"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface Stats {
  totalUsers: number;
  totalMedicines: number;
  totalOrders: number;
  totalRevenue: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: { name: string; email: string };
}

interface Category {
  id: string;
  name: string;
  _count: { medicines: number };
}

const statusColors: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "orders" | "categories">("overview");
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, ordersRes, catRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/orders"),
        api.get("/categories"),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setOrders(ordersRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Access denied. Admin account required.</p>
      </div>
    );
  }

  const handleBanToggle = async (userId: string, banned: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/${banned ? "unban" : "ban"}`);
      toast.success(banned ? "User unbanned" : "User banned");
      fetchAll();
    } catch {
      toast.error("Failed");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAddingCat(true);
    try {
      await api.post("/categories", { name: newCategory });
      toast.success("Category added");
      setNewCategory("");
      fetchAll();
    } catch {
      toast.error("Failed to add category");
    } finally {
      setAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchAll();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Platform overview and management</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "text-blue-700" },
            { label: "Medicines", value: stats.totalMedicines, icon: "💊", color: "text-emerald-700" },
            { label: "Orders", value: stats.totalOrders, icon: "📦", color: "text-purple-700" },
            { label: "Revenue", value: `$${stats.totalRevenue.toFixed(0)}`, icon: "💰", color: "text-orange-700" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["overview", "users", "orders", "categories"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg font-medium capitalize transition-colors ${tab === t ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : tab === "overview" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[150px]">{o.customer.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                  <span className="font-semibold text-emerald-700">${o.totalAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">User Roles</h3>
            <div className="space-y-3">
              {["CUSTOMER", "SELLER", "ADMIN"].map((role) => {
                const count = users.filter((u) => u.role === role).length;
                return (
                  <div key={role} className="flex justify-between items-center">
                    <span className="text-gray-600">{role}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : tab === "users" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.isBanned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {u.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => handleBanToggle(u.id, u.isBanned)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${u.isBanned ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                      >
                        {u.isBanned ? "Unban" : "Ban"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : tab === "orders" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{o.customer.name}</div>
                    <div className="text-xs text-gray-400">{o.customer.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-700">${o.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          <form onSubmit={handleAddCategory} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3">Add New Category</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={addingCat}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {addingCat ? "Adding..." : "Add"}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3">Category Name</th>
                  <th className="text-left px-4 py-3">Medicines</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500">{cat._count.medicines}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-xs text-red-500 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
