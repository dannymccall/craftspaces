import { Order as _ } from "@/app/lib/types/Order";
import React from "react";
import {
  formatDate,
  formatCurrency,
  toCapitalized,
} from "@/app/lib/helperFunctions";
import OrderModalControl, { ModalProps } from "../../admin/OrderModalControl";

interface OrderProps {
  order: _;
  index: number;
  actionButtons: React.ReactNode;
  modalType: "view" | "edit" | "delete" | null;
  setModalType: React.Dispatch<
    React.SetStateAction<"view" | "edit" | "delete" | null>
  >;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOrder: _;
  selectedIndex: number;
  onUpdate: () => void;
}
const Order = ({
  order,
  index,
  actionButtons,
  modalType,
  modalOpen,
  setModalOpen,
  setModalType,
  selectedOrder,
  selectedIndex,
  onUpdate,
}: OrderProps) => {
  const statusColors: Record<string, string> = {
    pending: "bg-amber-400 text-black",
    processing: "bg-blue-400 text-black",
    shipped: "bg-indigo-500 text-white",
    delivered: "bg-emerald-600 text-white",
    cancelled: "bg-red-500 text-white",
  };
  return (
    <>
      <OrderModalControl
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalType={modalType}
        index={index}
        selectedOrder={selectedOrder}
        setModalType={setModalType}
        selectedIndex={selectedIndex}
        onUpdate={onUpdate}
      />
      <tr className="border-b-1.5 border-gray-600 hover:bg-neutral-900 transition">
        <td className="text-amber-400">{index}</td>
        <td className="text-emerald-400">{order.order_id}</td>

        <td>{formatDate(order.created_at)}</td>
        <td>{order.billing_address}</td>
        <td>{order.shipping_address}</td>
        <td>{order.payment_method}</td>
        <td className="text-amber-300">{formatCurrency(order.total_amount)}</td>
        <td>{toCapitalized(order.payment_status)}</td>
        <td>
          <p
            className={`text-center rounded-md font-semibold px-3 py-1 ${
              statusColors[order.status]
            }`}
          >
            {toCapitalized(order.status)}
          </p>
        </td>
        <td className="px-4 py-2">{actionButtons}</td>
      </tr>
    </>
  );
};

export default Order;
