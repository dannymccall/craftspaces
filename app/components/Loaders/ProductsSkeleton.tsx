import React from "react";

const ProductSkeleton = () => {
  return (
    <>
      <div className="bg-neutral-800 rounded-xl p-4 animate-pulse space-y-4  shadow-lg">
        <div className="bg-neutral-700 h-[500px] w-full rounded-md" />
        <div className="h-4 bg-neutral-700 rounded w-1/4 m-auto my-3" />
        <div className="h-4 bg-neutral-700 rounded w-1/4 m-auto my-3" />
      </div>

      <div className="bg-neutral-800 rounded-xl p-4 animate-pulse space-y-4  shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10  py-2">
        <div className="bg-neutral-700 h-[500px]  rounded-md" />
        <div className=" bg-neutral-700 rounded" />
        <div className=" bg-neutral-700 rounded" />
      </div>
    </>
  );
};

export default ProductSkeleton;
