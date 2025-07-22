import React from "react";
import { Products as ProductsProps } from "@/app/lib/types/Product";
import Product from "@/app/components/shop/product/Product";
import ListComponent from "../../ListComponent";

interface ProductCategory extends ProductsProps {
  title: string;
}

const Products = ({ products, title }: ProductCategory) => {
  return (
    <section className="mt-24 px-6 w-full mx-auto relative  ">
      <h1 className="text-2xl font-bold text-white mb-8 text-start product-headings">
        {title}
      </h1>
      <div className="">
        <ListComponent
          data={products}
          renderItem={(product) => (
            <Product product={product} key={product.id} />
          )}
        />
      </div>
    </section>
  );
};

export default Products;
