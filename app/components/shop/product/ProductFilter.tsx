"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/app/context/SearchContext";
const filters: string[] = [
  "All",
  "Interior Design",
  "Kitchen Units",
  "Built-in & walk in closets",
  "Bedroom Suites",
  "Kids & Babies furniture",
  "Dinning room suites",
  "Outdoor Furniture",
  "Hotel & Spa Furniture",
  "Coffee Tables"
];

const ProductFilter = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const {setSearchQuery} = useSearch();
  
function handleOnClick(filter: string): void {
  setActiveFilter(filter);
  setSearchQuery(filter !== "All" ? filter : "");
  console.log("Filter clicked:", filter); // ✅ correct value
}

useEffect(() => {
  console.log("Updated activeFilter:", activeFilter);
}, [activeFilter]);

  return (
    <section className="w-full flex justify-center items-center">
      <motion.div
        className="flex-wrap gap-5 flex justify-center items-center border border-amber-400 rounded-md p-6 shadow-md hover:shadow-amber-400 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <motion.button
              key={filter}
              type="button"
              onClick={() => handleOnClick(filter)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`rounded-md py-1 px-3 border border-amber-400 cursor-pointer transition-all duration-300 
                hover:bg-amber-400 hover:text-neutral-800 hover:font-semibold 
                ${
                  isActive
                    ? "bg-amber-400 text-neutral-800 font-semibold"
                    : "text-amber-400"
                }`}
            >
              {filter}
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
};

export default ProductFilter;
