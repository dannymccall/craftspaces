import React from "react";
import { Order } from "@/app/lib/types/Order";
import FormLoading from "../Loaders/FormLoading";

interface DeleteOrderModalProps {
  selectedOrder: Order;
  onDelete: (seletedOrder: Order) => void;
  onCancel: () => void;
  pending: boolean;
}
const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({
  onDelete,
  onCancel,
  selectedOrder,
  pending,
}) => {
  return (
    <div className="text-white p-6 rounded-xl shadow-lg max-w-md mx-auto w-full space-y-6">
      <h2 className="text-xl font-bold text-center text-amber-500">
        {`Are you sure you want to delete this order? ID: ${selectedOrder.order_id}`}
      </h2>

      <div
        className={`flex justify-center gap-4 ${pending ? "bg-amber-400 p-2" : ""}`}
      >
        {pending ? (
          <FormLoading />
        ) : (
          <>
            <button
              onClick={() => onDelete(selectedOrder)}
              className="bg-amber-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-amber-400 transition"
            >
              Yes
            </button>
            <button
              onClick={onCancel}
              className="border border-white text-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-black transition"
            >
              No
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteOrderModal;
