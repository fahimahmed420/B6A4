"use client";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-xl font-bold text-gray-900">Please login to view cart</h2>
        <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700">Login</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">Add some medicines to your cart</p>
        <Link href="/shop" className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({items.length} items)</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : "💊"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-emerald-700 font-bold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  <Plus size={12} />
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 mt-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate max-w-[150px]">{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-emerald-700">${total().toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Cash on Delivery</p>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
