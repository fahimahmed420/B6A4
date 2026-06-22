"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import toast from "react-hot-toast";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  orderItems: { id: string; quantity: number; price: number; medicine: { name: string } }[];
}

const statusColors: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  const fetchOrders = () => {
    api.get("/orders/my")
      .then((res) => setOrders(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled");
      fetchOrders();
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  if (!user || user.role !== "CUSTOMER") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Please login as a customer to view orders.</p>
        <Link href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-full">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-600 font-medium">No orders yet</p>
          <Link href="/shop" className="inline-block mt-4 bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm font-medium text-gray-700">{order.id.slice(0, 16)}...</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.medicine.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="font-bold text-emerald-700">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                {order.status === "PLACED" && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="text-red-500 text-sm hover:text-red-700 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
