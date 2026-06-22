"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  price: number;
  image?: string;
  manufacturer: string;
  stock: number;
  category: { name: string };
}

export default function MedicineCard({ medicine }: { medicine: Medicine }) {
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to add items to cart"); return; }
    if (user.role !== "CUSTOMER") { toast.error("Only customers can add items to cart"); return; }
    addItem({ id: medicine.id, name: medicine.name, price: medicine.price, image: medicine.image, stock: medicine.stock });
    toast.success(`${medicine.name} added to cart`);
  };

  return (
    <Link href={`/shop/${medicine.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group border border-gray-200">
      <div className="relative h-44 bg-emerald-50 flex items-center justify-center overflow-hidden">
        {medicine.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={medicine.image} alt={medicine.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="text-6xl">💊</div>
        )}
        {medicine.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">{medicine.category.name}</span>
        <h3 className="font-bold text-gray-900 mt-2 text-sm line-clamp-2 leading-snug">{medicine.name}</h3>
        <p className="text-xs text-gray-600 mt-1 font-medium">{medicine.manufacturer}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-emerald-700 font-extrabold text-lg">${medicine.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={medicine.stock === 0}
            className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
        <p className="text-xs font-medium mt-1" style={{ color: medicine.stock < 10 ? '#dc2626' : '#16a34a' }}>
          {medicine.stock > 0 ? `${medicine.stock} in stock` : "Out of stock"}
        </p>
      </div>
    </Link>
  );
}
