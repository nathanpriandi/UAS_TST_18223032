export interface User {
  id: string; // Assuming ID exists, though plan mentions username/fullName/email
  username: string;
  fullName: string;
  email: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  rating?: {
    rate: number;
    count: number;
  };
  createdBy: string; // Maps to User ID
}

export interface CombinedProduct extends Product {
  creator?: User;
}