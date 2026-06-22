import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-white text-emerald-700 text-sm font-bold px-4 py-1 rounded-full mb-4 shadow">
              🛡️ Trusted OTC Medicine Store
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-white drop-shadow">
              Your Health, <br />
              <span className="text-yellow-300">Our Priority</span>
            </h1>
            <p className="text-white text-lg mb-8 max-w-md font-medium opacity-95">
              Shop genuine over-the-counter medicines from verified sellers. Fast delivery, competitive prices, and complete transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="bg-white text-emerald-700 font-bold px-8 py-3 rounded-full hover:bg-yellow-50 transition-all shadow-lg text-center text-base">
                Shop Now
              </Link>
              <Link href="/register" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-emerald-700 transition-all text-center text-base">
                Become a Seller
              </Link>
            </div>
            <div className="mt-10 flex gap-8">
              <div>
                <div className="text-3xl font-extrabold text-white">500+</div>
                <div className="text-yellow-300 text-sm font-semibold">Medicines</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">50+</div>
                <div className="text-yellow-300 text-sm font-semibold">Verified Sellers</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">10k+</div>
                <div className="text-yellow-300 text-sm font-semibold">Happy Customers</div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-80 h-80 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-9xl shadow-2xl border-4 border-white/30">
              💊
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
