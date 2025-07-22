"use client";

import React, { useEffect, useState } from "react";
import Orders from "@/app/components/shop/Orders/Orders";
import { makeRequest } from "@/app/lib/helperFunctions";
import { Order } from "@/app/lib/types/Order";
import TableSkeletonLoader from "@/app/components/Loaders/TableSkeletonLoader";
import { useFetch } from "@/app/hooks/useFetch";
import Customers from "@/app/components/admin/customer/Customers";
import { Customer } from "@/app/lib/types/Customer";
const AllCustomers = () => {
  const {
    data: customers,
    loading,
    error,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    handleSearch,
    refetch
  } = useFetch<Customer>({ uri: "/api/admin/dashboard", service:"fetchCustomers" });

  console.log({ customers });
  console.log(totalPages, currentPage);
  const onPageChange = (page: number) => {
    setPage(page);
  };
  // useEffect(() => {
  //   setHydrated(true);
  // }, []);

  if (loading && !hasLoaded) {
    return <TableSkeletonLoader columns={8} />;
  }

  // if (hasLoaded && orders.length === 0) {
  //   return <p className="text-sm text-center mt-20 mb-52">No orders found</p>;
  // }

  const handleChange = (value: string) => {
    handleSearch(value);
    setPage(1);
  };

  const onUpdate = () => {
    refetch()
  }
  return (
    <div className="mt-32 w-full">
      {((customers && customers.length > 0) || query) && (
        <div className="w-full md:w-1/2 m-auto mb-1 h-full">
          <input
            type="text"
            className="w-full hidden lg:block p-2 bg-[#1a1a1a] active:border active:border-[#FFD700] transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            placeholder="Search for customer"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      )}
      {customers && customers.length > 0 ? (
        <Customers
          customers={customers}
          onPageChange={onPageChange}
          page={currentPage}
          totalPage={totalPages}
          onUpdate={onUpdate}
        />
      ) : (
        <p className="text-sm text-center mt-20 mb-52">No Customer found</p>
      )}
    </div>
  );
};

export default AllCustomers;
