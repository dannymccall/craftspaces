import React, { useEffect, useState } from "react";
import { AllProductsProps } from "../lib/types/Product";
import { makeRequest } from "../lib/helperFunctions";
import { useSearch } from "@/app/context/SearchContext";

export function useFetchProducts() {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<AllProductsProps>();
  const { searchQuery, category } = useSearch();

  const fetchProducts = async (query: string = "") => {
    try {
      setLoading(true);

      const url = `/api/products/productRegistry?query=${encodeURIComponent(
        query
      )}`;

      const response = await makeRequest(url, {
        method: "GET",
      });

      setProducts(response);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery]);

  return { products, loading };
}
