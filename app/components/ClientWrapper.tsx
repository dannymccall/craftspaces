"use client";

import Footer from "./Footer";
import Navbar from "./Navbar";
import { NotificationProvider } from "../context/NotificationContext";
import { AuthProvider } from "../context/AuthContext";
import Toast from "./Toast";
import { SearchProvider } from "../context/SearchContext";
import MobileSearchBar from "./MobileSearchBar";
import { MobileSearchbarProvider } from "../context/MobileSearchbarContext";
import LiveSearchSuggestions from "./LiveSearchSuggestions";
import { CartProvider } from "../context/CartContext";
import { ProfileProvider } from "../context/ProfileContext";
import { ScrollProvider } from "../context/ScrollContext";
import SocketProviderClient from "./SocketProviderClient";
export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ProfileProvider>
          <SocketProviderClient>
          <CartProvider>
            <SearchProvider>
              <MobileSearchbarProvider>
                <ScrollProvider>
                  <div className="px-4 py-5 h-full">
                    <Navbar />
                    <MobileSearchBar />
                    <LiveSearchSuggestions />
                    {children}
                    <Footer />
                  </div>
                </ScrollProvider>
              </MobileSearchbarProvider>
            </SearchProvider>
          </CartProvider>
          </SocketProviderClient>
        </ProfileProvider>
      </AuthProvider>
      <Toast />
    </NotificationProvider>
  );
}
