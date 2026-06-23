export default function WhyChooseUs() {
  const features = [
    { icon: "✅", title: "Verified Products", desc: "All medicines are sourced from certified and verified sellers ensuring quality." },
    { icon: "🚚", title: "Fast Delivery", desc: "Get your medicines delivered to your doorstep quickly and safely." },
    { icon: "💰", title: "Best Prices", desc: "Competitive pricing with regular discounts and offers for loyal customers." },
    { icon: "🔒", title: "Secure Payments", desc: "Safe and secure payment processing with full encryption and privacy." },
    { icon: "📞", title: "24/7 Support", desc: "Our customer support team is available around the clock to help you." },
    { icon: "🌿", title: "OTC Only", desc: "We only sell over-the-counter medicines — no prescription required." },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose MediStore?</h2>
          <p className="text-gray-700 max-w-xl mx-auto font-medium">We are committed to providing you with the best online medicine shopping experience.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
