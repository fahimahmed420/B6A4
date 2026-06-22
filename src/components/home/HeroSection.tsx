import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-emerald-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
              🛡️ Trusted OTC Medicine Store
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Your Health, <br />
              <span className="text-emerald-200">Our Priority</span>
            </h1>
            <p className="text-emerald-100 text-lg mb-8 max-w-md">
              Shop genuine over-the-counter medicines from verified sellers. Fast delivery, competitive prices, and complete transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="bg-white text-emerald-700 font-bold px-8 py-3 rounded-full hover:bg-emerald-50 transition-all shadow-lg text-center"
              >
                Shop Now
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-emerald-700 transition-all text-center"
              >
                Become a Seller
              </Link>
            </div>
            <div className="mt-10 flex gap-8">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-emerald-200 text-sm">Medicines</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-emerald-200 text-sm">Verified Sellers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10k+</div>
                <div className="text-emerald-200 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-80 h-80 bg-emerald-500 rounded-full flex items-center justify-center text-9xl shadow-2xl">
              💊
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
