import React, { useState } from "react";
import Modal from "../Modal";
import { Order } from "@/app/lib/types/Order";
import { formatDate, toCapitalized } from "@/app/lib/helperFunctions";
import ModalViewForm from "./ModalViewForm";
import DeleteOrderModal from "./DeleteOrderModal";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
import ActionButtons from "../ActionButtons";
export interface ModalProps {
  modalType: "view" | "edit" | "delete" | null;
  setModalType: React.Dispatch<
    React.SetStateAction<"view" | "edit" | "delete" | null>
  >;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOrder: Order;
  index: number;
  selectedIndex: number;
  onUpdate: () => void;
}

const OrderModalControl = ({
  selectedOrder,
  modalType,
  setModalOpen,
  setModalType,
  index,
  modalOpen,
  selectedIndex,
  onUpdate,
}: ModalProps) => {
  const { showToast } = useNotification();
  const [pending, setPending] = useState<boolean>(false);

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const handleOnCancel = () => {
    setModalType(null);
    setModalOpen(false);
  };

  const handleOnDelete = async (order: Order) => {
    console.log(order.id);
    setPending(true);
    try {
      const response = await makeRequest(`/api/admin?id=${order.id}&service=deleteOrder`, {
        method: "DELETE",
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
      setPending(false);
      showToast(error.message, "error");
    }
  };
  const renderChild = () => {
    switch (modalType) {
      case "view":
      case "edit":
        // openModal("view");
        return (
          <>
            {modalOpen && selectedOrder && (
              <ModalViewForm
                formatDate={formatDate}
                toCapitalized={toCapitalized}
                modalType={modalType}
                index={index}
                selectedOrder={selectedOrder}
                actionButtons={
          
                    <ActionButtons
                    onView={() => handleOnCancel}
                    onDelete={() => handleOnDelete(selectedOrder)}
                      viewLabel="Cancel"
                    />
                }
                selectedIndex={selectedIndex}
                setModalType={setModalType}
                onUpdate={onUpdate}
                setModalOpen={setModalOpen}
              />
            )}
          </>
        );
      case "delete":
        return (
          <DeleteOrderModal
            onCancel={handleOnCancel}
            onDelete={handleOnDelete}
            selectedOrder={selectedOrder}
            pending={pending}
          />
        );
    }
  };
  return (
    <div className="opacity-50">
      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={closeModal}
      >
        {renderChild()}
      </Modal>
    </div>
  );
};

export default OrderModalControl;
