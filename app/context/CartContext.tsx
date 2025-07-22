import React, { useContext, createContext, useEffect, useState } from "react";
import { Cart } from "../lib/types/Product";

interface CartProps {
  cart: Cart[];
  addToCart: (product: Cart) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const CartContext = createContext<CartProps | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart[]>([]);

  useEffect(() => {
    setCartToState();
  }, []);

  const setCartToState = () => {
    const storedCart = localStorage.getItem("cart");
    setCart(storedCart ? JSON.parse(storedCart) : []);
  };

  const addToCart = (product: Cart) => {
    const exists = cart.find((item) => item.productId === product.productId);

    let newCartItems: Cart[] = [];
    if (exists) {
      console.log(exists);
      newCartItems = cart.map((item) =>
        item.productId === exists.productId
          ? { ...item, quantity: item.quantity! + 1 }
          : item
      );
    } else {
      newCartItems = [...cart, { ...product, quantity: 1 }];
    }


    localStorage.setItem("cart", JSON.stringify(newCartItems));
    setCartToState();
  };

  const removeFromCart = (productId: string) => {
    const newCartItems = cart.filter((item) => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(newCartItems));
    setCartToState();
  };

  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify([]));
    setCartToState();
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const newCartItems = cart.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: item.quantity! + quantity,
          }
        : item
    );
    localStorage.setItem("cart", JSON.stringify(newCartItems));
    setCartToState();
  };
  return (
    <CartContext.Provider
      value={{ cart, removeFromCart, addToCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context)
    throw new Error("Cart Provider must be used within Cart Context");
  return context;
};
