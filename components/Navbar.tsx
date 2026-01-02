import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Title - can be added later */}
          <div className="flex-1"></div>

          {/* Navigation Links */}
          <div className="flex items-center gap-12">
            <Link
              href="/shop"
              className="font-oswald text-sm uppercase tracking-widest text-[#E5E5E5] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              SHOP
            </Link>
            <Link
              href="/vision"
              className="font-oswald text-sm uppercase tracking-widest text-[#E5E5E5] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              VISION
            </Link>
            <Link
              href="/armory"
              className="font-oswald text-sm uppercase tracking-widest text-[#E5E5E5] hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              ARMORY
            </Link>
          </div>

          {/* Cart Icon */}
          <div className="flex-1 flex justify-end">
            <button className="text-[#E5E5E5] hover:text-white transition-colors">
              <ShoppingCart size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

