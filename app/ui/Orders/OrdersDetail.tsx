"use client";

import React, { useEffect, useState } from "react";
import Orders from "@/app/components/shop/Orders/Orders";
import { makeRequest } from "@/app/lib/helperFunctions";
import { Order } from "@/app/lib/types/Order";
import TableSkeletonLoader from "@/app/components/Loaders/TableSkeletonLoader";
import { OrderItem } from "@/app/lib/types/Order";
import OrdersDetail from "@/app/components/shop/OrderDetails/OrdersDetail";

interface OrderItemsProps {
    orderItems: OrderItem[]
}
const OrderItems = ({orderItems}:OrderItemsProps) => {
  return (
    <div>
      {orderItems && orderItems.length > 0 ? (
        <OrdersDetail orders={orderItems} />
      ) : (
        <TableSkeletonLoader />
      )}
    </div>
  );
};

export default OrderItems;
