"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ProductsSection() {
  const productImages = [
    "/videos/instagram/kamikaze.jpg",
    "/assets/Gtechniq.png",
    "/videos/instagram/IMG_9466.jpeg",
    "/assets/Rupes.png",
    "/assets/UPPF.png",
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
            High-quality detailing products perfect for maintaining your ceramic coated or waxed vehicle between professional visits.
          </p>
        </motion.div>

        <div className="mb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
          {productImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.5) }}
              className="group relative aspect-square w-full max-w-[200px] sm:max-w-[220px] overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Image
                src={image}
                alt={`Premium detailing product ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
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
