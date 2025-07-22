import { OrderItem as _ } from "@/app/lib/types/Order";
import React, { useState } from "react";
import {
  formatDate,
  formatCurrency,
  toCapitalized,
} from "@/app/lib/helperFunctions";
import { CgMenuGridO } from "react-icons/cg";
import Link from "next/link";
import { Order } from "@/app/lib/types/Order";
import { Product } from "@/app/lib/types/Product";
import ImageComponent from "../../Image";
import ViewOrderDetail from "./ViewOrderDetail";
interface OrderItemProps {
  orderItem: _;
  index: number
}
const OrderDetail = ({ orderItem, index }: OrderItemProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  return (
    <tr className="border-b-1.5 border-gray-600 hover:bg-neutral-900 transition">
      <td>
        {index}
      </td>
      <td>
        <ImageComponent src={orderItem.avatar!} width={50} height={50}/>
      </td>
      <td>{orderItem.title}</td>
      <td>{orderItem.description}</td>
      <td>{formatCurrency(orderItem.price)}</td>
      <td>{orderItem.quantity}</td>

      <td>{formatCurrency(Number(orderItem.total_amount!))}</td>
      <td>
        <button className="text-amber-400 text-lg cursor-pointer" onClick={() => setModalOpen(true)}>
          <CgMenuGridO />
        </button>
      </td>
      <ViewOrderDetail modalOpen={modalOpen} setModalOpen={setModalOpen} orderItem={orderItem}/>
    </tr>
  );
};

export default OrderDetail;
