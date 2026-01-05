"use client";

import { useEffect, useState } from "react";
import { getCombinedCatalog, getUsers, deleteProduct } from "../lib/api";
import { CombinedProduct, User } from "../types";
import ProductGrid from "../components/ProductGrid";
import UserTable from "../components/UserTable";
import SellerSelector from "../components/SellerSelector";
import InventoryForm from "../components/InventoryForm";

type Tab = "overview" | "inventory" | "sellers";

export default function Home() {
  const [products, setProducts] = useState<CombinedProduct[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Session State
  const [activeSellerId, setActiveSellerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  
  // Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, usersData] = await Promise.all([
        getCombinedCatalog(),
        getUsers(),
      ]);
      setProducts(productsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to load initial data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Admin Check Logic
  // Fix: Convert u.id to String because API returns numbers but Select returns strings
  const activeUser = users.find(u => String(u.id) === activeSellerId);
  const isAdmin = activeUser ? (activeUser.username === "admin" || String(activeUser.id) === "1") : false;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        showToast("Produk berhasil dihapus!");
        fetchData();
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const handleProductCreated = () => {
    showToast("Produk berhasil ditambahkan!");
    fetchData();
  };

  // Filter products for "My Inventory"
  const myProducts = activeSellerId 
    ? products.filter(p => String(p.createdBy) === activeSellerId) 
    : [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Integrated Marketplace Console
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            Sistem Manajemen Inventaris dengan Moderasi Identitas Terintegrasi
          </p>
        </div>

        {/* Unified Session Orchestrator */}
        <section className="max-w-xl mx-auto">
           <SellerSelector 
             users={users} 
             activeSellerId={activeSellerId} 
             onSelectSeller={setActiveSellerId} 
           />
           {isAdmin && (
             <p className="mt-2 text-center text-sm font-semibold text-red-600 dark:text-red-400">
               [ADMINISTRATOR MODE ACTIVE] - Full Moderation Privileges
             </p>
           )}
        </section>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-zinc-800">
          <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Marketplace Overview {isAdmin && "(Admin Access)"}
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`${
                activeTab === "inventory"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Daftar Produk Saya (Konsol Penjual)
            </button>
            <button
              onClick={() => setActiveTab("sellers")}
              className={`${
                activeTab === "sellers"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profil Identitas Terintegrasi
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {loading && <div className="text-center py-10">Loading integrated data...</div>}

          {!loading && activeTab === "overview" && (
            <section>
              <h2 className="sr-only">Marketplace Overview</h2>
              <ProductGrid 
                products={products} 
                activeSellerId={activeSellerId} 
                isAdmin={isAdmin}
                onDelete={handleDeleteProduct} // Allow delete if admin or owner
              />
            </section>
          )}

          {!loading && activeTab === "inventory" && (
            <section className="space-y-8">
              {!activeSellerId ? (
                <div className="text-center py-10 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    Silakan pilih "Identitas Penjual" di atas untuk mengelola inventaris Anda.
                  </p>
                </div>
              ) : (
                <>
                  <InventoryForm 
                    activeSellerId={activeSellerId} 
                    onSuccess={handleProductCreated} 
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Produk Saya ({myProducts.length})
                    </h3>
                    <ProductGrid 
                      products={myProducts} 
                      activeSellerId={activeSellerId}
                      // Admin can delete, but "My Inventory" implies owner's items anyway.
                      // Passing isAdmin here ensures consistency if admin views their own inventory.
                      isAdmin={isAdmin}
                      onDelete={handleDeleteProduct}
                    />
                  </div>
                </>
              )}
            </section>
          )}

          {!loading && activeTab === "sellers" && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Direktori Penjual Terdaftar
              </h2>
              <UserTable users={users} />
            </section>
          )}
        </div>

      </div>
    </main>
  );
}