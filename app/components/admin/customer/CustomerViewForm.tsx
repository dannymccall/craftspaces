import { Customer } from "@/app/lib/types/Customer";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaMoneyBillWave,
  FaTruck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
import FormLoading from "../../Loaders/FormLoading";
import Image from "next/image";
interface ModalViewFormProps {
  selectCustomer: Customer;
  index: number;
  formatDate: (date: string) => string;
  toCapitalized: (text: string) => string;
  actionButtons?: React.ReactNode;
  modalType: "view" | "edit" | "delete";
  setModalType: (type: "view" | "edit" | "delete") => void;
  selectedIndex: number;
  onUpdate: () => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomerViewForm: React.FC<ModalViewFormProps> = ({
  selectCustomer,
  index,
  formatDate,
  toCapitalized,
  actionButtons,
  modalType,
  setModalType,
  selectedIndex,
  onUpdate,
  setModalOpen,
}) => {
  const isView = modalType === "view";
  const { showToast } = useNotification();
  const [pending, setPending] = useState<boolean>(false);
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      number: selectedIndex + 1,
      name: selectCustomer.name,
      email: selectCustomer.email,
      role: selectCustomer.role,
      Avatar: selectCustomer.avatar,
      emailVerified: Boolean(selectCustomer.email_verified)
        ? "Verified"
        : "Not Verified",
    },
  });

  //   const statusColors: Record<string, string> = {
  //     pending: "bg-amber-400 text-black",
  //     processing: "bg-blue-400 text-black",
  //     shipped: "bg-indigo-500 text-white",
  //     delivered: "bg-emerald-600 text-white",
  //     cancelled: "bg-red-500 text-white",
  //   };



  return (
    <form
    //   onSubmit={handleSubmit(onSubmit)}
      className="relative text-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto w-full space-y-4 "
    >
      {/* Toggle Edit/View Button */}
      {/* <button
        type="button"
        onClick={() => setModalType(isView ? "edit" : "view")}
        className="absolute top-4 right-4 text-amber-400 border border-amber-500 px-3 py-1 rounded-md hover:bg-amber-500 hover:text-black transition"
      >
        {isView ? "Edit" : "View"}
      </button> */}

      <h2 className="text-amber-500 text-xl font-bold text-center mb-4">
        Customer Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col sm:col-span-2">
          <span className="text-amber-400">Avarta</span>
          {selectCustomer.avatar ? (
            <Image
              src={selectCustomer.avatar}
              alt="customer"
              width={40}
              height={40}
              className="rounded-md"
            />
          ) : (
            "N/A"
          )}
        </label>
        <label className="flex flex-col">
          <span className="text-amber-400">No.#</span>
          <input
            {...register("number")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            disabled
          />
        </label>

        <label className="flex flex-col">
          <span className="text-amber-400 flex items-center gap-1">
            <FaCalendarAlt /> Name
          </span>
          <input
            {...register("name")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            disabled
          />
        </label>

        <label className="flex flex-col sm:col-span-2">
          <span className="text-amber-400 flex items-center gap-1">
            <FaMapMarkerAlt /> Email
          </span>
          <textarea
            {...register("email")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            rows={2}
            disabled
          />
        </label>

        <label className="flex flex-col sm:col-span-2">
          <span className="text-amber-400 flex items-center gap-1">
            <FaTruck />
            Role
          </span>
          <input
            {...register("role")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            disabled
          />
        </label>

        <label className="flex flex-col sm:col-span-2">
          <span className="text-amber-400 flex items-center gap-1">
            <FaMoneyBillWave /> Email Verified
          </span>
          <input
            {...register("emailVerified")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            disabled
          />
        </label>
      </div>

      {/* Save button (only shows in edit mode) */}
      {!isView && (
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            className="bg-amber-500 w-full cursor-pointer text-black disabled:opacity-70 px-4 py-2 rounded-md font-semibold hover:bg-amber-400 transition"
            disabled={pending}
          >
            {pending ? <FormLoading /> : "Save"}
          </button>
        </div>
      )}

      {/* Optional additional action buttons (delete, close, etc) */}
      {actionButtons && (
        <div className="pt-4 flex justify-center">{actionButtons}</div>
      )}
    </form>
  );
};

export default CustomerViewForm;
