import React, { useState } from "react";
import { FaCreditCard, FaMapMarkerAlt, FaTimes, FaUser } from "react-icons/fa";
import { MdEmail, MdSecurity, MdOutlineDateRange } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { billingInfoSchema } from "@/app/lib/definitions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLoading from "../Loaders/FormLoading";
import { useCart } from "@/app/context/CartContext";

import SidebarComponent from "../SidebarComponent";
export type BillingInfo = z.infer<typeof billingInfoSchema>;

interface BillingProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  grandTotal: number;
  onSubmit: (data: BillingInfo) => Promise<void>;
  pending: boolean;
}
export default function BillingInfo({
  isOpen,
  setIsOpen,
  grandTotal,
  onSubmit,
  pending,
}: BillingProps) {
  //   const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BillingInfo>({
    defaultValues: {
      fullName: "",
      cardNumber: "",
      cvv: "",
      expiry: "",
      shippingAddress: "",
      email: "",
    },
    resolver: zodResolver(billingInfoSchema),
  });
  return (
      <SidebarComponent isOpen={isOpen} setIsOpen={setIsOpen}>
        <h2 className="md:text-3xl text-xl font-bold text-amber-400 mb-6">
          Billing Details
        </h2>
        <div className="flex justify-end mb-4">
          <IoMdClose
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-100 hover:text-neutral-800 transition-all duration-300 cursor-pointer rounded-full"
            size={25}
          />
        </div>

        {/* Customer Info */}
        {cart && (
          <>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit(onSubmit)}
              id="billingInfo"
            >
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-amber-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-neutral-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      {...register("fullName")}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm ml-8 mt-3">
                      {errors.fullName.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-amber-400" />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full bg-neutral-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm ml-8 mt-3">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-amber-400" />
                    <input
                      type="text"
                      placeholder="Shipping Address"
                      className="w-full bg-neutral-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      {...register("shippingAddress")}
                    />
                  </div>
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-sm ml-8 mt-3">
                      {errors.shippingAddress.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-amber-400" />
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full bg-neutral-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      {...register("cardNumber")}
                    />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-red-500 text-[11px] ml-8 mt-3">
                      {errors.cardNumber.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-amber-400" />
                      <input
                        type="text"
                        placeholder="Expiry (MM/YY)"
                        className="w-full bg-neutral-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                        {...register("expiry")}
                      />
                    </div>
                    {errors.expiry && (
                      <p className="text-red-500 text-sm ml-8 mt-3">
                        {errors.expiry.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-amber-400" />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full bg-neutral-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                        {...register("cvv")}
                      />
                    </div>
                    {errors.cvv && (
                      <p className="text-red-500 text-sm ml-8 mt-3">
                        {errors.cvv.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Order Summary */}
            </form>
            <div className="mt-8 border-t border-neutral-600 pt-6 w-full">
              <h3 className="text-2xl font-semibold text-amber-400 mb-4 w-full">
                Order Summary
              </h3>
              <div className="flex justify-between text-lg mb-2 w-full">
                <span>Subtotal</span>
                <span>₵{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg mb-2">
                <span>Shipping</span>
                <span>₵20.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4 text-amber-400">
                <span>Total</span>
                <span>₵{(grandTotal + 20).toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-amber-400 text-black font-semibold py-3 rounded-xl disabled:bg-gray-500 hover:bg-amber-500 transition cursor-pointer"
                form="billingInfo"
                disabled={pending}
              >
                {pending ? <FormLoading /> : "Confirm Payment"}
              </button>
            </div>
          </>
        )}
      </SidebarComponent>
    
  );
}
