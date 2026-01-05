import axios from "axios";
import { Product, User, CombinedProduct } from "../types";

const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || "";
const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "";

// --- Data Fetching ---

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getCombinedCatalog = async (): Promise<CombinedProduct[]> => {
  const [users, products] = await Promise.all([getUsers(), getProducts()]);

  return products.map((product) => {
    // Logic: matching "Product.createdBy" field with User ID
    // Note: Assuming "createdBy" in product holds the User ID
    const creator = users.find((u) => String(u.id) === String(product.createdBy));
    return {
      ...product,
      creator,
    };
  });
};

// --- CRUD Operations ---

export const createProduct = async (productData: Omit<Product, "id" | "rating">, userId: string) => {
  try {
    const payload = {
      ...productData,
      createdBy: userId, // Inject Seller Identity strictly from session
      image: "https://placehold.co/400", // Default placeholder
      rating: { rate: 0, count: 0 }
    };

    const response = await axios.post(`${PRODUCT_SERVICE_URL}/api/products`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await axios.delete(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
