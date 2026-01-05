import { User } from "../types";

interface SellerSelectorProps {
  users: User[];
  activeSellerId: string | null;
  onSelectSeller: (userId: string) => void;
}

export default function SellerSelector({ users, activeSellerId, onSelectSeller }: SellerSelectorProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Pilih Identitas Penjual (Active Session)
      </label>
      <select
        value={activeSellerId || ""}
        onChange={(e) => onSelectSeller(e.target.value)}
        className="w-full rounded-md border border-gray-300 p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      >
        <option value="" disabled>-- Pilih User --</option>
        {users.map((user) => (
          <option key={user.id || user.username} value={user.id}>
            {user.fullName} ({user.email})
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        *Semua aksi "Tambah Produk" akan dikaitkan dengan user ini.
      </p>
    </div>
  );
}