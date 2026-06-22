"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { ShoppingCart, ArrowLeft } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  manufacturer: string;
  dosage?: string;
  category: { name: string };
  seller: { name: string };
  reviews: { id: string; rating: number; comment?: string; customer: { name: string }; createdAt: string }[];
}

export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    api.get(`/medicines/${id}`)
      .then((res) => setMedicine(res.data.data))
      .catch(() => router.push("/shop"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleAddToCart = () => {
    if (!user) { toast.error("Please login first"); return; }
    if (user.role !== "CUSTOMER") { toast.error("Only customers can add to cart"); return; }
    if (!medicine) return;
    addItem({ id: medicine.id, name: medicine.name, price: medicine.price, image: medicine.image, stock: medicine.stock });
    toast.success(`${medicine.name} added to cart!`);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "CUSTOMER") { toast.error("Please login as customer to review"); return; }
    setSubmittingReview(true);
    try {
      await api.post("/reviews", { medicineId: id, ...reviewForm });
      toast.success("Review submitted!");
      const res = await api.get(`/medicines/${id}`);
      setMedicine(res.data.data);
      setReviewForm({ rating: 5, comment: "" });
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating = medicine?.reviews.length
    ? (medicine.reviews.reduce((s, r) => s + r.rating, 0) / medicine.reviews.length).toFixed(1)
    : "No ratings";

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin text-4xl">💊</div></div>;
  if (!medicine) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-emerald-50 rounded-2xl flex items-center justify-center h-80">
          {medicine.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <div className="text-9xl">💊</div>
          )}
        </div>

        <div>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">{medicine.category.name}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-2">{medicine.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>⭐ {avgRating}</span>
            <span>•</span>
            <span>{medicine.reviews.length} reviews</span>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{medicine.description}</p>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Manufacturer</span>
              <span className="font-medium">{medicine.manufacturer}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Dosage</span>
              <span className="font-medium">{medicine.dosage || "See packaging"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Seller</span>
              <span className="font-medium">{medicine.seller.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Stock</span>
              <span className={`font-medium ${medicine.stock < 10 ? "text-red-600" : "text-green-600"}`}>
                {medicine.stock > 0 ? `${medicine.stock} units` : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-emerald-700">${medicine.price.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={medicine.stock === 0}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart size={20} />
            {medicine.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

        {user?.role === "CUSTOMER" && (
          <form onSubmit={handleReview} className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ⭐</option>)}
              </select>
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your experience..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {medicine.reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {medicine.reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {r.customer.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{r.customer.name}</div>
                    <div className="text-yellow-400 text-xs">{"⭐".repeat(r.rating)}</div>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-gray-600 text-sm ml-12">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
