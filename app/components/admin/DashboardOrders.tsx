import React, { useEffect, useState } from "react";
import { Order as _Order } from "@/app/lib/types/Order";
import TableHeader, { TableColumn } from "@/app/components/TableHeader";
import Order from "@/app/components/shop/Orders/Order";
import { useDebounce } from "@/app/hooks/useDebounce";
import ActionButtons from "@/app/components/ActionButtons";
import { useRouter } from "next/navigation";

interface OrdersProps {
  orders: _Order[];
  page: number;
  onPageChange: (page: number) => void;
  totalPage?: number;
  onUpdate: () => void;
}
const DashboardOrders = ({ orders, onPageChange, totalPage, page, onUpdate }: OrdersProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<_Order | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null
  );
  const columns: TableColumn[] = [
    { key: "index", label: "No.#", sortable: true },
    { key: "order-id", label: "Order-ID", sortable: true },

    { key: "order-date", label: "Order Date", sortable: true },
    { key: "billing-address", label: "Billing Address" },
    {
      key: "shipping-address",
      label: "Shipping Address",
      sortable: true,
      filterable: true,
    },
    { key: "payment-type", label: "Payment Type", align: "right" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "payment-status", label: "Payment Status", align: "right" },
    { key: "order-status", label: "Order Status", align: "right" },
    { key: "action", label: "Action", align: "right" },
  ];
  const router = useRouter();

  const onSort = (key: string) => {
    console.log("Sort by:", key);
  };

  const onFilter = (key: string) => {
    console.log("Filter:", key);
  };

  const updateFormProperties = (
    order: _Order,
    index: number,
    type: "view" | "edit" | "delete" | null
  ) => {
    setModalOpen(true);
    setModalType(type);
    setSelectedOrder(order);
    setSelectedIndex(index);
  };

  const handleOnClickView = (order: _Order, index: number) => {
    updateFormProperties(order, index, "view");
  };

  return (
    <div className="w-full md:px-12 py-6 overflow-x-auto">
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-neutral-800 text-white text-sm md:text-base table">
          <TableHeader columns={columns} onSort={onSort} onFilter={onFilter} />
          <tbody>
            {orders.map((order, index) => (
              <Order
                order={order}
                key={order.order_id}
                index={index + 1}
                actionButtons={
                  <ActionButtons
                    onView={() => handleOnClickView(order, index)}
                  />
                }
                modalOpen={modalOpen}
                modalType={modalType}
                setModalOpen={setModalOpen}
                setModalType={setModalType}
                selectedOrder={selectedOrder!}
                selectedIndex={selectedIndex}
                onUpdate={onUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPage!}
          onPageChange={onPageChange}
        />
      </div> */}
    </div>
  );
};

export default DashboardOrders;
