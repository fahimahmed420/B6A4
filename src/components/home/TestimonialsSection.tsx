export default function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah M.", rating: 5, text: "MediStore has been a lifesaver! I can order my regular OTC medicines without leaving home. Fast delivery and great prices.", avatar: "👩" },
    { name: "James K.", rating: 5, text: "Amazing selection of vitamins and supplements. The search and filter make it easy to find exactly what I need.", avatar: "👨" },
    { name: "Priya S.", rating: 4, text: "Very convenient platform. Verified sellers give me confidence in the product quality. Highly recommend!", avatar: "👩‍💼" },
    { name: "Robert T.", rating: 5, text: "Ordered pain relief medicines and they arrived the next day. Excellent customer service too!", avatar: "🧔" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
          <p className="text-gray-500">Thousands of satisfied customers trust MediStore</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-yellow-400 text-sm">{"⭐".repeat(t.rating)}</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
