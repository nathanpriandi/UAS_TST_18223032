import { CombinedProduct } from "../types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: CombinedProduct[];
  activeSellerId?: string | null;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function ProductGrid({ products, activeSellerId, isAdmin, onDelete }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          activeSellerId={activeSellerId}
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-10 text-gray-500">
            No products available.
        </div>
      )}
    </div>
  );
}