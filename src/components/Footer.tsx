import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white text-lg font-bold mb-3">
              <span className="text-2xl">💊</span>
              <span>MediStore</span>
            </div>
            <p className="text-sm text-gray-400">Your trusted online medicine shop. Quality OTC medicines delivered to your doorstep.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop Medicines</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Pain Relief</li>
              <li className="hover:text-white cursor-pointer">Vitamins</li>
              <li className="hover:text-white cursor-pointer">Antibiotics</li>
              <li className="hover:text-white cursor-pointer">Allergy & Sinus</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 support@medistore.com</li>
              <li>📞 +1 (800) MEDI-123</li>
              <li>🕒 Mon–Fri: 9am–6pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MediStore. All rights reserved. OTC medicines only — no prescription required.</p>
        </div>
      </div>
    </footer>
  );
}
