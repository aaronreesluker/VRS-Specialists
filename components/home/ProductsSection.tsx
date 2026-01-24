"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ProductsSection() {
  const productImages = [
    "/videos/instagram/RangeRAB4.jpg",
    "/videos/instagram/RangeRAB6.jpg",
    "/videos/instagram/kamikaze.jpg",
    "/batch1/8e944fb6-0859-484d-bd8d-635dc62924d5.jpeg",
    "/batch1/fceddf41-b1f6-444f-bbea-56b44911ec1a.jpeg",
    "/batch1/18e40c0a-bb27-4b78-b114-abe7edbe9e3e.jpeg",
    "/batch1/81ebc876-1f0a-4db5-b7ee-7b8713944e50.jpeg",
    "/batch1/506cdf67-138a-4b76-9400-57f181bcb38f.jpeg",
    "/batch1/923e2af4-a6e7-4fe6-8208-89a81c2b60d6.jpeg",
    "/batch1/8653a52b-16c3-45c4-8de6-4ab0c1b13efd.jpeg",
    "/batch1/ad046933-d5d6-4449-9b90-d50dfdd04bea.jpeg",
    "/batch1/b54d51c7-289e-4194-ba85-c296d306ed66.jpeg",
    "/batch1/be07a1db-c68f-49b7-8f71-9c8a73d39f02.jpeg",
    "/batch1/db3246bc-7f21-4b14-8145-7ed4c14ac7e6.jpeg",
    "/batch1/f8e2cf2a-e796-4e42-afc8-b92cd05b4d5a.jpeg",
    "/batch1/f122847e-c8af-476f-b43a-cc2f791b1103.jpeg",
    "/batch1/f538234c-e2f7-4583-97f2-55609f95bcc7.jpeg",
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
