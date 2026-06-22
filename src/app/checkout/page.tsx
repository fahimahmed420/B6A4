"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user || user.role !== "CUSTOMER") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Please login as a customer to checkout.</p>
        <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full">Login</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🛒</div>
        <p className="text-gray-600">Your cart is empty.</p>
        <Link href="/shop" className="bg-emerald-600 text-white px-6 py-2 rounded-full">Shop Now</Link>
      </div>
    );
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) { setError("Shipping address is required"); return; }
    setLoading(true);
    try {
      await api.post("/orders", {
        shippingAddress: address,
        items: items.map((i) => ({ medicineId: i.id, quantity: i.quantity })),
      });
      clearCart();
      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to place order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleOrder} className="space-y-5">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Shipping Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={user.name} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-600" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={user.email} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
              <textarea
                value={address}
                onChange={(e) => { setAddress(e.target.value); setError(""); }}
                rows={3}
                placeholder="Enter your full shipping address..."
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${error ? "border-red-500" : "border-gray-300"}`}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-3">Payment Method</h2>
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl">💵</div>
              <div>
                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when your order arrives</p>
              </div>
              <div className="ml-auto w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors text-lg"
          >
            {loading ? "Placing Order..." : `Place Order • $${total().toFixed(2)}`}
          </button>
        </form>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-fit">
          <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : "💊"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">× {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-emerald-700">${total().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
