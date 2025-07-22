"use client";

import React, { useEffect, useState } from "react";
import { useFetchProducts } from "@/app/hooks/useFetchProducts";
import { useSearch } from "@/app/context/SearchContext";
import ProductDisplay from "@/app/components/shop/product/ProductDisplay";

const Products = () => {
  const [ready, setReady] = useState(false);
  const { setSearchQuery } = useSearch();

  useEffect(() => {
    setSearchQuery(""); // reset
    setReady(true);     // now safe to fetch
  }, []);

  return (
    <main className="w-full mb-24">
      {ready && <ProductDisplay showFilter />}
    </main>
  );
};

export default Products;

