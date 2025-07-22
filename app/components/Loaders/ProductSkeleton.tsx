import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-5xl h-[500px] flex flex-col gap-3 md:flex-row">
        <div className="bg-neutral-700 h-full animate-pulse w-full rounded-md" />
        <div className="w-full h-full flex flex-col  p-4 animate-pulse space-y-4  shadow-lg gap-3  py-2">
          <div className="bg-neutral-700 h-full rounded-md" />
          <div className=" bg-neutral-700 h-full rounded" />
          <div className=" bg-neutral-700 h-full rounded" />
          <div className=" bg-neutral-700 h-full rounded" />
          <div className=" bg-neutral-700 h-full rounded" />

        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
