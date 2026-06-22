"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name || form.name.length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.password || form.password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Account created successfully!");
      if (form.role === "SELLER") router.push("/seller/dashboard");
      else router.push("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💊</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join MediStore today</p>
        </div>

        {/* Role selector */}
        <div className="flex gap-3 mb-6">
          {["CUSTOMER", "SELLER"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2.5 rounded-lg border-2 font-medium text-sm transition-all ${form.role === r ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:border-emerald-300"}`}
            >
              {r === "CUSTOMER" ? "🛒 Customer" : "🏪 Seller"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
              placeholder="Min 6 characters"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Your address"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
