"use client";

import React from "react";
import ProductDisplay from "@/app/components/shop/product/ProductDisplay";

const Category = ({ category }: { category: string }) => {

  return (
    <main className="w-full mb-24">
       <ProductDisplay showFilter={false}/>
    </main>
  );
};

export default Category;
