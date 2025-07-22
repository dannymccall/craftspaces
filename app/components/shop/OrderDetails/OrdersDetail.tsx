import React from "react";
import { OrderItem as _ } from "@/app/lib/types/Order";
import TableHeader, { TableColumn } from "../../TableHeader";
import ListComponent from "../../ListComponent";
import OrderDetail from "./OrderDetail";
import FillEmptySpaces from "../../FillEmptySpaces";
import { formatCurrency } from "@/app/lib/helperFunctions";
import DataRow from "../../DataRow";
interface OrdersProps {
  orders: _[];
}
const OrdersDetail = ({ orders }: OrdersProps) => {
  const columns: TableColumn[] = [
    { key: "index", label: "No.#", sortable: true },
    { key: "avatar", label: "Avatar", sortable: true },
    { key: "title", label: "Title" },
    {
      key: "description",
      label: "Description",
      sortable: true,
      filterable: true,
    },
    { key: "price", label: "Price", align: "right" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "total-amount", label: "Total Amount", align: "right" },
    { key: "action", label: "Action", align: "right" },
  ];

  const onSort = (key: string) => {
    console.log("Sort by:", key);
  };

  const onFilter = (key: string) => {
    console.log("Filter:", key);
  };

  const totalPrice = orders.reduce(
    (total, order) => total + Number(order.price),
    0
  );
  const totalQuantity = orders.reduce(
    (total, order) => total + order.quantity,
    0
  );
  const totalAmount = orders.reduce(
    (total, order) => total + Number(order.total_amount),
    0
  );

  return (
    <div className="w-full mt-28 min-h-screen px-4 md:px-12 py-6 overflow-x-auto">
      {" "}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-neutral-800 text-white text-sm md:text-base table">
          <TableHeader columns={columns} onSort={onSort} onFilter={onFilter} />
          <tbody>
            {orders.map((order, index) => (
              <OrderDetail orderItem={order} key={index} index={index + 1}/>
            ))}
          </tbody>
          <DataRow
            label="Total"
            values={[
              "", // fill empty space if needed
              formatCurrency(totalPrice),
              totalQuantity,
              formatCurrency(totalAmount),
            ]}
            FillEmptySpaces={<FillEmptySpaces length={1} />}
          />
        </table>
      </div>
    </div>
  );
};

export default OrdersDetail;
