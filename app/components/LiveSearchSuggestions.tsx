"use client";

import React, { useEffect, useState, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../context/SearchContext";

type Suggestion = {
  value: string;
  type: "title" | "category";
};

const LiveSearchSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { typedQuery, setTypedQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (typedQuery.trim().length > 1) {
        fetchSuggestions(typedQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [typedQuery]);

  const fetchSuggestions = async (search: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/search-suggestions?search=${search}`
      );
      const data = await res.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (value: string, type: string) => {
    setSuggestions([]);
    if (type === "title") {
      setSearchQuery(value);
      router.push("/shop/products");
    } else {
      setSearchQuery(value);
      router.push(`/shop/product/${encodeURIComponent(value)}`);
      setTypedQuery("");
    }
  };

  return (
    <AnimatePresence>
      {typedQuery && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed w-full  md:mx-0 top-20 md:top-24  bg-neutral-900  rounded-md shadow-2xl z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((item, i) => (
            <div
              key={i}
              className="px-4 flex justify-between items-center py-2 hover:bg-neutral-800 text-gold cursor-pointer text-lg"
              onClick={() => handleSuggestionClick(item.value, item.type)}
            >
              <p>{item.value}</p> 
              <p className="text-gray-500 text-sm italic mr-5">Search Type: <span className="font-semibold">{item.type}</span></p> 
              
            </div>
          ))}
        </motion.div>
      )}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute right-3 top-3 animate-pulse text-gold text-xs"
        >
          Loading...
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveSearchSuggestions;
