import { useState } from "react";
import { CombinedProduct } from "../types";

interface ProductCardProps {
  product: CombinedProduct;
  activeSellerId?: string | null;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onUpdateStock?: (id: string, newStock: number) => void;
  onBuy?: (product: CombinedProduct) => Promise<void>;
}

export default function ProductCard({ product, activeSellerId, isAdmin, onDelete, onUpdateStock, onBuy }: ProductCardProps) {
  const [isBuying, setIsBuying] = useState(false);

  const isCreator = activeSellerId && String(product.createdBy) === String(activeSellerId);
  const ownershipCount = (activeSellerId && product.owners && product.owners[activeSellerId]) || 0;
  const isOwner = ownershipCount > 0;

  const showDelete = (isCreator || isAdmin) && onDelete;
  const showRestock = (isCreator || isAdmin) && onUpdateStock;
  const showBuy = activeSellerId && !isCreator && onBuy;

  const handleBuy = async () => {
    if (onBuy && product.stock > 0) {
      setIsBuying(true);
      try {
        await onBuy(product);
      } finally {
        setIsBuying(false);
      }
    }
  };

  const handleRestock = () => {
    if (onUpdateStock) {
      onUpdateStock(product.id, Number(product.stock) + 5);
    }
  };

  return (
    <div className={`flex flex-col border rounded-lg p-4 shadow-sm hover:shadow-md transition-all bg-white dark:bg-zinc-900 ${isCreator ? 'border-green-400 ring-1 ring-green-400 dark:border-green-600' : 'border-gray-200 dark:border-zinc-800'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400">
          {product.category}
        </span>
        <div className="text-right flex flex-col items-end gap-1">
          <span className="block text-lg font-bold text-gray-900 dark:text-white">
            ${product.price}
          </span>
          
          {product.stock === 0 ? (
             <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-900/30 dark:text-red-400">
               Habis
             </span>
          ) : product.stock < 5 ? (
             <span className="inline-block px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full dark:bg-orange-900/30 dark:text-orange-400 animate-pulse">
               ⚠️ Sisa: {product.stock}
             </span>
          ) : (
             <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-400">
               Stok: {product.stock}
             </span>
          )}

          {isOwner && (
            <span className="inline-block px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
              Dimiliki: {ownershipCount}
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
      
      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800">
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        {showBuy && (
          <button
            disabled={product.stock === 0 || isBuying}
            onClick={handleBuy}
            className={`col-span-2 py-2 rounded text-sm font-bold transition-colors flex justify-center items-center ${
              product.stock > 0 && !isBuying
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-zinc-800"
            }`}
          >
            {isBuying ? (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            {product.stock > 0 ? (isBuying ? "Memproses..." : "🛒 Beli Sekarang") : "Habis"}
          </button>
        )}

        {showRestock && (
          <button
            onClick={handleRestock}
            className="flex-1 py-2 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-bold hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50"
          >
            + Restock (5)
          </button>
        )}

        {showDelete && (
          <button
            onClick={() => onDelete && onDelete(product.id)}
            className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
              isCreator 
                ? "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20" 
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isCreator ? "Hapus" : "Moderasi"}
          </button>
        )}
      </div>
    </div>
  );
}