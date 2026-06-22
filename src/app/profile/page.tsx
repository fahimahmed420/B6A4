"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "" });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full">Login</Link>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const res = await api.put("/auth/profile", form);
      setAuth(res.data.data, token!);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const roleColors: Record<string, string> = {
    CUSTOMER: "bg-blue-100 text-blue-700",
    SELLER: "bg-orange-100 text-orange-700",
    ADMIN: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-700">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${roleColors[user.role]}`}>
              {user.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={user.email} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              placeholder="Your address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {user.role === "CUSTOMER" && (
        <Link href="/orders" className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-semibold text-gray-900">My Orders</p>
              <p className="text-sm text-gray-500">View your order history</p>
            </div>
            <span className="ml-auto text-gray-400">→</span>
          </div>
        </Link>
      )}
    </div>
  );
}
