"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, Package } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: { name: string };
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: { name: string; email: string };
  orderItems: { medicine: { name: string }; quantity: number }[];
}

const statusColors: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function SellerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"inventory" | "orders">("inventory");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", manufacturer: "", dosage: "", categoryId: "", image: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [medRes, orderRes, catRes] = await Promise.all([
        api.get("/medicines/seller/my"),
        api.get("/orders/seller/all"),
        api.get("/categories"),
      ]);
      setMedicines(medRes.data.data || []);
      setOrders(orderRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (!user || user.role !== "SELLER") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Access denied. Seller account required.</p>
      </div>
    );
  }

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "", stock: "", manufacturer: "", dosage: "", categoryId: categories[0]?.id || "", image: "" });
    setShowModal(true);
  };

  const openEdit = (med: Medicine) => {
    setEditingId(med.id);
    setForm({ name: med.name, description: "", price: String(med.price), stock: String(med.stock), manufacturer: "", dosage: "", categoryId: med.category.name, image: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.manufacturer || !form.categoryId || !form.description) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editingId) {
        await api.put(`/medicines/${editingId}`, payload);
        toast.success("Medicine updated!");
      } else {
        await api.post("/medicines", payload);
        toast.success("Medicine added!");
      }
      setShowModal(false);
      fetchData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this medicine?")) return;
    try {
      await api.delete(`/medicines/${id}`);
      toast.success("Medicine deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user.name}</p>
        </div>
        {tab === "inventory" && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <Plus size={18} /> Add Medicine
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-700">{medicines.length}</div>
          <div className="text-sm text-gray-500 mt-1">Total Medicines</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-700">{orders.length}</div>
          <div className="text-sm text-gray-500 mt-1">Total Orders</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-700">
            ${orders.filter(o => o.status === "DELIVERED").reduce((s, o) => s + o.totalAmount, 0).toFixed(0)}
          </div>
          <div className="text-sm text-gray-500 mt-1">Revenue</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["inventory", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg font-medium capitalize transition-colors ${tab === t ? "bg-emerald-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
          >
            {t === "inventory" ? <span className="flex items-center gap-1.5"><Package size={16} /> Inventory</span> : "Orders"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : tab === "inventory" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {medicines.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">💊</div>
              <p className="text-gray-500">No medicines yet. Add your first medicine!</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {medicines.map((med) => (
                  <tr key={med.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{med.name}</td>
                    <td className="px-4 py-3 text-gray-600">{med.category.name}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">${med.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${med.stock < 10 ? "text-red-600" : "text-gray-700"}`}>{med.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(med)} className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDelete(med.id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No orders yet.</div>
          ) : orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <p className="text-xs text-gray-400">{order.customer.email} • {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {order.orderItems.map((item, i) => (
                  <span key={i} className="mr-3">• {item.medicine.name} × {item.quantity}</span>
                ))}
              </div>
              <p className="font-bold text-emerald-700 mt-2">${order.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Medicine" : "Add Medicine"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                <input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                <input value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                  placeholder="e.g. 1 tablet twice daily"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2.5 font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-emerald-600 text-white rounded-lg py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                  {submitting ? "Saving..." : editingId ? "Update" : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
