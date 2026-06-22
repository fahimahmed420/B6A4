"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Category {
  id: string;
  name: string;
  _count: { medicines: number };
}

const categoryIcons: Record<string, string> = {
  "Pain Relief": "🩹",
  "Antibiotics": "🧬",
  "Vitamins & Supplements": "💊",
  "Allergy & Sinus": "🤧",
  "Digestive Health": "🫁",
  "Cold & Flu": "🤒",
  "Skin Care": "🧴",
  "Eye Care": "👁️",
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const colors = [
    "bg-blue-50 hover:bg-blue-100 border-blue-200",
    "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
    "bg-purple-50 hover:bg-purple-100 border-purple-200",
    "bg-orange-50 hover:bg-orange-100 border-orange-200",
    "bg-pink-50 hover:bg-pink-100 border-pink-200",
    "bg-teal-50 hover:bg-teal-100 border-teal-200",
    "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
    "bg-red-50 hover:bg-red-100 border-red-200",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-500">Find the right medicine from our wide selection of categories</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?categoryId=${cat.id}`}
              className={`border rounded-xl p-5 text-center transition-all cursor-pointer ${colors[i % colors.length]}`}
            >
              <div className="text-3xl mb-2">{categoryIcons[cat.name] || "💊"}</div>
              <div className="font-semibold text-gray-800 text-sm">{cat.name}</div>
              <div className="text-xs text-gray-500 mt-1">{cat._count.medicines} items</div>
            </Link>
          ))}
          {categories.length === 0 && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`border rounded-xl p-5 text-center animate-pulse ${colors[i % colors.length]}`}>
              <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
