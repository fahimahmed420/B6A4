"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import MedicineCard from "@/components/MedicineCard";

interface Medicine {
  id: string;
  name: string;
  price: number;
  image?: string;
  manufacturer: string;
  stock: number;
  category: { name: string };
}

export default function FeaturedMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/medicines?limit=8")
      .then((res) => setMedicines(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Featured Medicines</h2>
            <p className="text-gray-700 font-medium">Top products from our verified sellers</p>
          </div>
          <Link href="/shop" className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors font-medium">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="bg-gray-200 h-40 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {medicines.map((med) => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
