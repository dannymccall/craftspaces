import React, { useEffect, useState } from "react";
import { Order as _Order } from "@/app/lib/types/Order";
import TableHeader, { TableColumn } from "../../TableHeader";
import ListComponent from "../../ListComponent";
import Pagination from "../../Pagination";
import { useDebounce } from "@/app/hooks/useDebounce";
import ActionButtons from "../../ActionButtons";
import { useRouter } from "next/navigation";
import Customer from "./Customer";
import { Customer as _Customer } from "@/app/lib/types/Customer";
interface OrdersProps {
  customers: _Customer[];
  page: number;
  onPageChange: (page: number) => void;
  totalPage?: number;
  onUpdate: () => void;
  className?: string
}
const Customers = ({ customers, onPageChange, totalPage, page, onUpdate, className = "min-h-screen" }: OrdersProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectCustomer, setSelectCustomer] = useState<_Customer | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null
  );
  const columns: TableColumn[] = [
    { key: "index", label: "No.#", sortable: true },
    { key: "name", label: "Name", sortable: true },

    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role" },
    {
      key: "email-verified",
      label: "Email Verified",
      sortable: true,
      filterable: true,
    },
    { key: "avatar", label: "Avatar", align: "right" },
    { key: "actions", label: "Action", align: "right" },

  ];
  const router = useRouter();

  const onSort = (key: string) => {
    console.log("Sort by:", key);
  };

  const onFilter = (key: string) => {
    console.log("Filter:", key);
  };

  const updateFormProperties = (
    customer: _Customer,
    index: number,
    type: "view" | "edit" | "delete" | null
  ) => {
    setModalOpen(true);
    setModalType(type);
    setSelectCustomer(customer);
    setSelectedIndex(index);
  };

  const handleOnClickView = (customer: _Customer, index: number) => {
    updateFormProperties(customer, index, "view");
  };

  return (
    <div className={`w-full ${className} px-4 md:px-12 py-6 overflow-x-auto`}>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-neutral-800 text-white text-sm md:text-base table">
          <TableHeader columns={columns} onSort={onSort} onFilter={onFilter} />
          <tbody>
            {customers.map((customer, index) => (
              <Customer
                customer={customer}
                key={customer.id}
                index={index + 1}
                actionButtons={
                  <ActionButtons
                    onView={() => handleOnClickView(customer, index)}
                  />
                }
                modalOpen={modalOpen}
                modalType={modalType}
                setModalOpen={setModalOpen}
                setModalType={setModalType}
                selectedIndex={selectedIndex}
                onUpdate={onUpdate}
                selectedCustomer={selectCustomer!}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPage!}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default Customers;
