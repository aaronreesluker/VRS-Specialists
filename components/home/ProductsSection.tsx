"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ProductsSection() {
  const productImages = [
    "/videos/instagram/F8F6.jpg",
    "/videos/instagram/F8F7.jpg",
    "/videos/instagram/RangeRAB4.jpg",
    "/videos/instagram/RangeRAB6.jpg",
    "/videos/instagram/Product.jpg",
    "/videos/instagram/stck.jpeg",
    "/videos/instagram/kamikaze.jpg",
  ];

  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Premium Detailing Products
          </h2>
          <p
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            High-quality detailing products from Tenzi UK, perfect for maintaining your ceramic coated or waxed vehicle between professional visits.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {productImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-square w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Image
                src={image}
                alt={`Premium detailing product ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, (max-width: 1200px) 220px, 240px"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="https://vrsdetailingshop.company.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-center hover:bg-white hover:text-black transition-colors uppercase tracking-wider inline-block text-lg"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Shop All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
