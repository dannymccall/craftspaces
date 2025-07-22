import React from "react";
import {
  formatDate,
  formatCurrency,
  toCapitalized,
} from "@/app/lib/helperFunctions";
import OrderModalControl, { ModalProps } from "../../admin/OrderModalControl";
import { Customer as _Customer } from "@/app/lib/types/Customer";
import Image from "next/image";
import CustomerModalControl from "./CustomerModalControl";
interface OrderProps {
  customer: _Customer;
  index: number;
  actionButtons: React.ReactNode;
  modalType: "view" | "edit" | "delete" | null;
  setModalType: React.Dispatch<
    React.SetStateAction<"view" | "edit" | "delete" | null>
  >;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCustomer: _Customer;
  selectedIndex: number;
  onUpdate: () => void;
}
const Customer = ({
  customer,
  index,
  actionButtons,
  modalType,
  modalOpen,
  setModalOpen,
  setModalType,
  selectedCustomer,
  selectedIndex,
  onUpdate,
}: OrderProps) => {
  
  return (
    <>
     <CustomerModalControl
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalType={modalType}
        index={index}
        selectCustomer={selectedCustomer}
        setModalType={setModalType}
        selectedIndex={selectedIndex}
        onUpdate={onUpdate}
      />
      <tr className="border-b-1.5 border-gray-600 hover:bg-neutral-900 transition">
        <td className="text-amber-400">{index}</td>
        <td className="text-emerald-400">{customer.name}</td>

        <td>{customer.email}</td>
        <td>{customer.role}</td>
        <td>{Boolean(customer.email_verified)? "Verified" : "Not Verified"}</td>
        <td>
          {customer.avatar ? (
            <Image
              src={customer.avatar}
              alt="customer"
              width={40}
              height={40}
              className="rounded-md"
            />
          ) : (
            "N/A"
          )}
        </td>
        <td className="py-2">{actionButtons}</td>
      </tr>
    </>
  );
};

export default Customer;
