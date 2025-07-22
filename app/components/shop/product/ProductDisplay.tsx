"use client";

import React from "react";
import ImageChange from "@/app/components/ImageChange";
import { images } from "@/app/lib/essentials";
import AllProducts from "@/app/components/shop/product/Products";
import ProductSkeleton from "@/app/components/Loaders/ProductsSkeleton";
import NoProductFound from "@/app/components/NoProductFound";
import { motion } from "framer-motion";
import ProductFilter from "@/app/components/shop/product/ProductFilter";
import { useFetchProducts } from "@/app/hooks/useFetchProducts";

type ProductDisplayProps = {
  showFilter?: boolean; // conditionally render the filter
};

const ProductDisplay = ({ showFilter = true }: ProductDisplayProps) => {
  const { products, loading } = useFetchProducts();

  if (!products) return <ProductSkeleton />;

  return (
    <>
      <div className="">
        <ImageChange images={images} className="h-[500px]" />
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-white my-10 text-center product-headings_1">
        Explore Our Products
      </h2>

      {showFilter && <ProductFilter />}

      {products.allProducts.length > 0 ? (
        <>
          <AllProducts products={products.allProducts} title="All Products" />
          <AllProducts
            products={products.recentProducts || products.allProducts}
            title="Recently Added"
          />
          <AllProducts
            products={products.ratedProducts || products.allProducts}
            title="Most Rated Products"
          />
        </>
      ) : (
        <NoProductFound>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`rounded-md py-1 px-3 border border-amber-400 cursor-pointer transition-all duration-300 
            hover:bg-amber-400 hover:text-neutral-800 hover:font-semibold`}
          >
            View All Products
          </motion.button>
        </NoProductFound>
      )}
    </>
  );
};

export default ProductDisplay;
