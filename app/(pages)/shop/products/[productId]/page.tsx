import React from "react";
import ProductSkeleton from "@/app/components/Loaders/ProductSkeleton";
import { makeRequest } from "@/app/lib/helperFunctions";
import ProductCard from "@/app/components/shop/product/ProductCard";
async function getProduct(productId: string) {
  try {
    const response = await makeRequest(
      `${process.env.BASE_URL}/api/products/productRegistry?productId=${productId}`,
      { method: "GET", cache: "no-store" }
    );

    console.log(response);
    if (response) return response;

    throw new Error("Something happened", response);
  } catch (error) {
    console.log(error);
  }
}

const Product = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const productId = (await params).productId;
  console.log(productId);
  if (!productId) throw new Error("Invalid Request");

  const response = await getProduct(productId);

  console.log(response);

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center">
      {Object.keys(response).length > 0 ? <ProductCard product={response} /> : <ProductSkeleton />}
    </div>
  );
};

export default Product;
