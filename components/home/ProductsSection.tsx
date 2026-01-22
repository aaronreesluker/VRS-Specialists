"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ProductsSection() {
  const products = [
    {
      name: "VRS Maintenance Kit",
      description: "Complete maintenance kit for ceramic coated or waxed vehicles",
      price: "£200.00",
      image: "/videos/instagram/IMG_9466.jpeg",
      featured: true,
    },
    {
      name: "Foam White pH7 Snow Foam",
      description: "Premium snow foam - 700ml",
      price: "£19.00",
      image: "/videos/instagram/F8F6.jpg",
    },
    {
      name: "Car Shampoo Conditioner",
      description: "Premium car shampoo - 770ml",
      price: "£10.00",
      image: "/videos/instagram/F8F7.jpg",
    },
    {
      name: "Quick Shine",
      description: "Quick detailing spray - 600ml",
      price: "£12.00",
      image: "/videos/instagram/RangeRAB4.jpg",
    },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-gray-900 border-2 border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gray-800">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <span className="text-gray-600 text-sm">No image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-2 text-white group-hover:text-primary-500 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-2xl font-bold text-primary-500 mb-3"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {product.price}
                </p>
                <p
                  className="text-gray-300 text-sm"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {product.description}
                </p>
              </div>
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
          <p
            className="text-gray-400 mt-4 text-sm"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Questions about products or maintenance? Contact us at{" "}
            <a
              href="tel:08000029083"
              className="text-primary-500 hover:underline"
            >
              08000029083
            </a>{" "}
            or{" "}
            <a
              href="mailto:info@vrsspecialists.com"
              className="text-primary-500 hover:underline"
            >
              info@vrsspecialists.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
