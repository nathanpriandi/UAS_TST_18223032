import { CombinedProduct } from "../types";

interface ProductCardProps {
  product: CombinedProduct;
  activeSellerId?: string | null;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function ProductCard({ product, activeSellerId, isAdmin, onDelete }: ProductCardProps) {
  // Fix: Ensure strict string comparison for ownership
  const isOwner = activeSellerId && String(product.createdBy) === String(activeSellerId);
  const showDelete = (isOwner || isAdmin) && onDelete;

  return (
    <div className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-900 ${isOwner ? 'border-green-400 ring-1 ring-green-400 dark:border-green-600' : 'border-gray-200 dark:border-zinc-800'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400">
          {product.category}
        </span>
        <div className="text-right">
          <span className="block text-lg font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
          {product.stock > 0 ? (
             <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
               Stok: {product.stock}
             </span>
          ) : (
             <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-900/30 dark:text-red-400">
               Stok Habis
             </span>
          )}
        </div>
      </div>
      <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-100 line-clamp-1">
        {product.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
        {product.description}
      </p>
      
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Created By</p>
        {product.creator ? (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
              {product.creator.fullName}
            </span>
            <span className="text-xs text-gray-500">
              {product.creator.email}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Unknown Creator (ID: {product.createdBy})</span>
        )}
      </div>

      {showDelete && (
        <div className={`mt-4 pt-3 border-t border-dashed ${isOwner ? 'border-green-200 dark:border-green-900/50' : 'border-red-200 dark:border-red-900/50'}`}>
           <button
             onClick={() => onDelete && onDelete(product.id)}
             className={`w-full text-xs font-medium py-2 rounded transition-colors ${
               isOwner 
                 ? "border border-red-600 text-red-600 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20" 
                 : "text-white bg-red-600 hover:bg-red-700"
             }`}
           >
             {isOwner ? "Hapus Produk (Owner Action)" : "Moderasi Produk (Admin Action)"}
           </button>
        </div>
      )}
    </div>
  );
}