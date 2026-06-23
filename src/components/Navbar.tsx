"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const cartCount = useCartStore((s) => s.count());
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <nav className="bg-emerald-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-wide">
            <span className="text-2xl">💊</span>
            <span className="text-white drop-shadow">MediStore</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="hover:text-emerald-200 transition-colors">Shop</Link>
            {user?.role === "SELLER" && (
              <Link href="/seller/dashboard" className="hover:text-emerald-200 transition-colors">Dashboard</Link>
            )}
            {user?.role === "ADMIN" && (
              <Link href="/admin/dashboard" className="hover:text-emerald-200 transition-colors">Admin</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user?.role === "CUSTOMER" && (
              <Link href="/cart" className="relative hover:text-emerald-200">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-1 hover:text-emerald-200">
                  <User size={18} />
                  <span className="text-sm">{user.name.split(" ")[0]}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-300">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="hover:text-emerald-200">Login</Link>
                <Link href="/register" className="bg-white text-emerald-700 px-4 py-1.5 rounded-full font-medium hover:bg-emerald-50 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-700 px-4 pb-4 space-y-2">
          <Link href="/shop" className="block py-2 hover:text-emerald-200" onClick={() => setMenuOpen(false)}>Shop</Link>
          {user?.role === "CUSTOMER" && (
            <Link href="/cart" className="block py-2 hover:text-emerald-200" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
          )}
          {user?.role === "SELLER" && (
            <Link href="/seller/dashboard" className="block py-2 hover:text-emerald-200" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin/dashboard" className="block py-2 hover:text-emerald-200" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          {user ? (
            <>
              <Link href="/profile" className="block py-2 hover:text-emerald-200" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block py-2 text-red-300 w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 hover:text-emerald-200" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="block py-2 hover:text-emerald-200" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
