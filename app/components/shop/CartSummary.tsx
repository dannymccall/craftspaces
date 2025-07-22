import React from "react";
import { motion } from "framer-motion";
import { Product } from "@/app/lib/types/Product";
import { Cart } from "@/app/lib/types/Product";
import { formatCurrency } from "@/app/lib/helperFunctions";

interface SummaryProps {
  products: Cart[];
  onCheckout: () => void;
  totalQuantity: number;
  grandTotal: number
}

const CartSummary = ({ onCheckout, products, totalQuantity, grandTotal }: SummaryProps) => {
 

  return (
    <section className="mt-6 flex justify-center md:justify-end">
      <div className="w-full md:w-1/3 shadow-2xl p-2">
        <h1 className="text-lg mb-3 text-amber-400">Cart Summary</h1>
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">Items</p>
          <span className="text-sm text-gray-400">{products.length}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">Total Quantity</p>
          <span className="text-sm text-gray-400">{totalQuantity}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-400">Grand Total</p>
          <span className="text-sm text-gray-400">
            ₵{grandTotal.toFixed(2)}
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 3 }}
          className="bg-amber-400 text-neutral-800 text-sm px-4 py-1 rounded-md mt-3 font-bold cursor-pointer hover:bg-amber-700 transition-all duration-300"
          onClick={onCheckout}
        >
          Checkout
        </motion.button>
      </div>
    </section>
  );
};

export default CartSummary;
