"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaCartPlus } from "react-icons/fa";
import { ProductProps } from "@/app/lib/types/Product";
import { formatCurrency, toCapitalized } from "@/app/lib/helperFunctions";
import { useCart } from "@/app/context/CartContext";

const ProductCard = ({ product }: ProductProps) => {
  const { addToCart } = useCart();

  return (
    <section className="container mx-auto px-4 py-10">
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-xl ring-1 ring-neutral-800 md:max-w-5xl md:flex-row"
      >
        {/* === PRODUCT IMAGE === */}
        <div className="relative h-[500px] w-full  md:w-1/2">
          <Image
            src={product.avatar}
            alt={product.title}
            fill
            className="object-cover object-center brightness-95 transition-transform duration-300 hover:scale-[1.01]"
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1280px) 50vw,
                   33vw"
            priority
          />
        </div>

        {/* === PRODUCT DETAILS === */}
        <div className="flex flex-col gap-6 p-8 md:w-1/2">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-amber-400">
              {toCapitalized(product.title)}
            </h1>
            <p className="text-sm leading-relaxed text-neutral-300 line-clamp-5">
              {toCapitalized(product.description)}
            </p>
          </header>

          <p className="text-3xl font-bold tracking-wider text-white">
            {formatCurrency(product.price)}
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              addToCart({
                productId: product.product_id,
                title: product.title,
                avatar: product.avatar,
                price: product.price,
                id: product.id,
              })
            }
            className="mt-auto cursor-pointer flex w-full items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-500 md:w-2/3"
          >
            <FaCartPlus className="text-lg" /> Add to Cart
          </motion.button>
        </div>
      </motion.article>
    </section>
  );
};

export default ProductCard;
