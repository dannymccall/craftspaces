"use client";

import React from "react";
import { ProductProps } from "@/app/lib/types/Product";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { useScroll } from "@/app/context/ScrollContext";

const Product = ({ product }: ProductProps) => {
  const {  addToCart } = useCart();
  const { setShowNavbar } = useScroll();

  const handleAddToCart = () => {
    addToCart({
      productId: product.product_id,
      title: product.title,
      avatar: product.avatar,
      price: product.price,
      id: product.id,
    });

    setShowNavbar(true);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-[240px] bg-neutral-800 rounded-xl overflow-hidden shadow-lg hover:shadow-amber-500/20 transition duration-300 hover:-translate-y-2"
    >
      <Link
        href={`/shop/products/${product.product_id}`}
        className="block relative w-full h-52"
      >
        <Image
          src={product.avatar}
          alt={product.title}
          fill
          objectFit="cover"
          className="brightness-75 hover:brightness-90 transition"
        />
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex row justify-between items-center">
          <h3 className="text-base font-semibold text-white">
            {product.title}
          </h3>
          <p className="text-sm text-neutral-400">GHS {product.price}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-amber-400 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-500 transition cursor-pointer"
          onClick={handleAddToCart} // Replace with actual cart handler
        >
          <FaCartPlus /> Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Product;
