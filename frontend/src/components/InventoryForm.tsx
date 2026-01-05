"use client";

import { useState } from "react";
import { createProduct, updateProductStock } from "../lib/api";
import { CombinedProduct } from "../types";

interface InventoryFormProps {
  activeSellerId: string;
  onSuccess: (msg: string) => void;
  currentInventory: CombinedProduct[];
}

export default function InventoryForm({ activeSellerId, onSuccess, currentInventory }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "general",
    stock: "0"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      setError("Judul dan Harga wajib diisi.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // Check for duplicates (Case Insensitive)
      const existingProduct = currentInventory.find(
        (p) => p.title.toLowerCase().trim() === formData.title.toLowerCase().trim()
      );

      if (existingProduct) {
        // Update existing product stock
        const newStock = existingProduct.stock + Number(formData.stock);
        await updateProductStock(existingProduct.id, newStock);
        onSuccess(`Produk sudah ada. Stok diperbarui menjadi ${newStock}.`);
      } else {
        // Create new product
        await createProduct({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image: "", // Handled by API default or placeholder
          createdBy: activeSellerId
        }, activeSellerId);
        onSuccess("Produk baru berhasil ditambahkan!");
      }
      
      setFormData({ title: "", price: "", description: "", category: "general", stock: "0" });
    } catch (err) {
      console.error(err);
      setError("Gagal memproses data. Pastikan service aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">
        Tambah Produk Baru ke Inventaris
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Produk</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-md border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            placeholder="Contoh: Kopi Bubuk Arabika"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Harga ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full rounded-md border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stok Barang</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full rounded-md border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full rounded-md border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
        >
          <option value="general">Umum</option>
          <option value="electronics">Elektronik</option>
          <option value="clothing">Pakaian</option>
          <option value="food">Makanan</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          placeholder="Deskripsi singkat produk..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
      >
        {loading ? "Menyimpan..." : "+ Tambah / Update Produk"}
      </button>
    </form>
  );
}