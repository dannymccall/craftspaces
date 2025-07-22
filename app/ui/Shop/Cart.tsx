"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import CartSummary from "@/app/components/shop/CartSummary";
import BillingInfo, {
  BillingInfo as BillingInfoProps,
} from "@/app/components/shop/BillingInfo";
import { useMe } from "@/app/hooks/useMe";
import { useNotification } from "@/app/context/NotificationContext";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useCart } from "@/app/context/CartContext";
import { useSocketContext } from "@/app/context/SocketContext";

const CartComponent = () => {
  const { cart,clearCart, removeFromCart, updateQuantity} = useCart();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const user = useMe();
  const { showToast } = useNotification();
  const totalQuantity = cart.reduce((total, item) => total + item.quantity!, 0);

  const { socket, isConnected } = useSocketContext();

  
  const grandTotal = cart.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)),0)
  const onSubmit = async (data: BillingInfoProps) => {
    try {
      setPending(true);
      if (!user) {
        showToast("Login to complete your purchase", "error");
        setPending(false);
        return;
      }
      console.log(data);
      const response = await makeRequest(`/api/orders`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          totalAmount: grandTotal,
          cartItems: cart,
        }),
      });

      if (!response.success) {
        showToast(response.message, "error");
        setPending(false);

        return;
      }

      showToast(response.message, "success");
      setIsOpen(false);
      setPending(false);
      clearCart();
      socket?.emit("orderAdded", "A new order has been added");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-neutral-900 min-h-screen w-full px-4 mt-20 sm:px-8 py-10 text-white flex justify-center items-center">
      <BillingInfo
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        grandTotal={grandTotal}
        onSubmit={onSubmit}
        pending={pending}
      />

      <div className="w-full max-w-2xl bg-neutral-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-amber-400 text-center">
          Your Cart
        </h2>

        {cart.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center">
            <p className="text-gray-400">Your cart is empty.</p>
            <Image src={"/404.png"} alt="404.png" width={300} height={300} />
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row items-center sm:justify-between border-b border-neutral-700 pb-4 gap-4"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.avatar}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-400">
                    Unit Price: ₵{item.price}
                  </p>
                  <p className="text-sm font-bold text-amber-400">
                    Subtotal: ₵{(item.price * item.quantity!).toFixed(2)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, Number(-1))}
                      className="bg-amber-400 text-black p-2 rounded hover:bg-amber-500 transition disabled:bg-gray-500 cursor-pointer"
                      disabled={item.quantity === 0}
                    >
                      <FaMinus />
                    </button>
                    <span className="text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, Number(1))}
                      className="bg-amber-400 text-black p-2 rounded hover:bg-amber-500 transition cursor-pointer"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700 text-sm mt-1 flex items-center gap-1"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}

            {/* 🔴 Clear Cart Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={clearCart}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}

        {/* Cart Summary & Checkout */}
        {cart.length > 0 && (
          <CartSummary
            onCheckout={() => setIsOpen(true)}
            products={cart}
            totalQuantity={totalQuantity}
            grandTotal={grandTotal}
          />
        )}
      </div>
    </div>
  );
};

export default CartComponent;
