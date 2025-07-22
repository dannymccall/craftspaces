import { Order } from "@/app/lib/types/Order";
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
import FormLoading from "../Loaders/FormLoading";

interface ModalViewFormProps {
  selectedOrder: Order;
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

const ModalViewForm: React.FC<ModalViewFormProps> = ({
  selectedOrder,
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
      orderDate: formatDate(selectedOrder.created_at.toString()),
      billingAddress: selectedOrder.billing_address,
      shippingAddress: selectedOrder.shipping_address,
      paymentMethod: selectedOrder.payment_method,
      totalAmount: selectedOrder.total_amount,
      paymentStatus: toCapitalized(selectedOrder.payment_status),
      orderStatus: toCapitalized(selectedOrder.status),
    },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-amber-400 text-black",
    processing: "bg-blue-400 text-black",
    shipped: "bg-indigo-500 text-white",
    delivered: "bg-emerald-600 text-white",
    cancelled: "bg-red-500 text-white",
  };

  const onSubmit = async (data: any) => {
    console.log("Form Submitted:", data);
    setModalType("view");

    try {
      setPending(true);
      const response = await makeRequest(`/api/admin?id=${selectedOrder.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...data,
          orderId: selectedOrder.order_id,
          userId: selectedOrder.user_id
        }),
      });
      if (!response.success) {
        setPending(false);
        showToast(response.message, "error");
        return;
      }
      setPending(false);
      showToast(response.message, "success");
      setModalOpen(false);
      onUpdate();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative text-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto w-full space-y-4 "
    >
      {/* Toggle Edit/View Button */}
      <button
        type="button"
        onClick={() => setModalType(isView ? "edit" : "view")}
        className="absolute top-4 right-4 text-amber-400 border border-amber-500 px-3 py-1 rounded-md hover:bg-amber-500 hover:text-black transition"
      >
        {isView ? "Edit" : "View"}
      </button>

      <h2 className="text-amber-500 text-xl font-bold text-center mb-4">
        Order Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <FaCalendarAlt /> Order Date
          </span>
          <input
            {...register("orderDate")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            disabled
          />
        </label>

        <label className="flex flex-col sm:col-span-2">
          <span className="text-amber-400 flex items-center gap-1">
            <FaMapMarkerAlt /> Billing Address
          </span>
          <textarea
            {...register("billingAddress")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            rows={2}
            disabled={isView}
          />
        </label>

        <label className="flex flex-col sm:col-span-2">
          <span className="text-amber-400 flex items-center gap-1">
            <FaTruck /> Shipping Address
          </span>
          <textarea
            {...register("shippingAddress")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            rows={2}
            disabled={isView}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-amber-400 flex items-center gap-1">
            <FaMoneyBillWave /> Payment Method
          </span>
          <input
            {...register("paymentMethod")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            disabled={isView}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-amber-400">Amount</span>
          <input
            {...register("totalAmount")}
            type="number"
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            disabled={isView}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-amber-400">Payment Status</span>
          <input
            {...register("paymentStatus")}
            className="bg-neutral-800 border border-amber-500 rounded p-2"
            disabled={isView}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-amber-400 flex items-center gap-1">
            <FaCheckCircle /> Order Status
          </span>

          {isView ? (
            <div
              className={`text-center rounded-md font-semibold p-2 ${
                statusColors[selectedOrder.status]
              }`}
            >
              {toCapitalized(selectedOrder.status)}
            </div>
          ) : (
            <select
              {...register("orderStatus")}
              className="bg-neutral-800 text-white border border-amber-500 rounded p-2"
            >
              {[
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => (
                <option key={status} value={toCapitalized(status)}>
                  {toCapitalized(status)}
                </option>
              ))}
            </select>
          )}
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
        <div className="pt-4 flex justify-end">{actionButtons}</div>
      )}
    </form>
  );
};

export default ModalViewForm;
