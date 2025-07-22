import React from 'react';
import Modal from '../../Modal';
import { OrderItem } from '@/app/lib/types/Order';
import Image from 'next/image';
interface ViewOrderDetailProps {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  orderItem: OrderItem;
}

const ViewOrderDetail = ({
  modalOpen,
  setModalOpen,
  orderItem,
}: ViewOrderDetailProps) => {
  return (
    <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div className="p-4 md:p-6 w-full max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-4">
          Order Item Details
        </h2>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          {orderItem.avatar && (
            <Image
              src={orderItem.avatar}
              alt={orderItem.title || 'Product Image'}
              className="w-32 h-32 object-cover rounded-md shadow-md"
              width={100}
              height={100}
            />
          )}

          <div className="flex-1 space-y-2 w-full">
            <div className="grid grid-cols-2 gap-2 text-sm md:text-base">
              <div className="font-medium text-neutral-500">Order ID:</div>
              <div>{orderItem.order_id}</div>

              <div className="font-medium text-neutral-500">Product ID:</div>
              <div>{orderItem.product_id}</div>

              <div className="font-medium text-neutral-500">Quantity:</div>
              <div>{orderItem.quantity}</div>

              <div className="font-medium text-neutral-500">Price:</div>
              <div>₵{orderItem.price}</div>

              {orderItem.total_amount && (
                <>
                  <div className="font-medium text-neutral-500">Total:</div>
                  <div>₵{orderItem.total_amount}</div>
                </>
              )}

              {orderItem.category && (
                <>
                  <div className="font-medium text-neutral-500">Category:</div>
                  <div>{orderItem.category}</div>
                </>
              )}
            </div>

            {orderItem.title && (
              <div>
                <h3 className="mt-4 text-lg font-semibold">{orderItem.title}</h3>
              </div>
            )}

            {orderItem.description && (
              <p className="text-sm text-neutral-400">{orderItem.description}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewOrderDetail;
