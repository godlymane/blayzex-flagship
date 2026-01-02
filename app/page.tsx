"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-[1]"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-12">
          {/* Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-8xl sm:text-6xl md:text-9xl font-bold uppercase tracking-widest text-[#E5E5E5] text-center"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            FOR THE 1%
          </motion.h1>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="px-8 py-4 bg-transparent border border-white text-[#E5E5E5] uppercase tracking-widest hover:bg-white/10 transition-colors"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            ENTER THE ARMORY
          </motion.button>
        </div>
      </section>

      {/* The Armory Section */}
      <section className="min-h-screen bg-[#050505] py-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <h2
            className="text-4xl font-bold uppercase tracking-widest text-[#E5E5E5] text-center mb-12"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            THE ARMORY
          </h2>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <a
              href="https://blayzexv2-0.myshopify.com/products/9204184154332"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 group cursor-pointer">
                <img
                  src="/p1.jpg"
                  alt="BLOODWEB TEE"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3
                className="uppercase tracking-widest text-[#E5E5E5] mb-2"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                BLOODWEB TEE
              </h3>
              <p
                className="text-[#E5E5E5]"
                style={{ fontFamily: "monospace" }}
              >
                $299.99
              </p>
            </a>

            {/* Product Card 2 */}
            <div className="flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden mb-4 group cursor-pointer">
                <img
                  src="/p2.jpg"
                  alt="V2 OVERSIZED"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3
                className="uppercase tracking-widest text-[#E5E5E5] mb-2"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                V2 OVERSIZED
              </h3>
              <p
                className="text-[#E5E5E5]"
                style={{ fontFamily: "monospace" }}
              >
                $349.99
              </p>
            </div>

            {/* Product Card 3 */}
            <div className="flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden mb-4 group cursor-pointer">
                <img
                  src="/p3.jpg"
                  alt="TACTICAL SHORTS"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3
                className="uppercase tracking-widest text-[#E5E5E5] mb-2"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                TACTICAL SHORTS
              </h3>
              <p
                className="text-[#E5E5E5]"
                style={{ fontFamily: "monospace" }}
              >
                $399.99
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
