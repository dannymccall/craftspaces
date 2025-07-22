"use client";
import React, { useEffect, useRef, useState } from "react";
import FormLoading from "@/app/components/Loaders/FormLoading";
// import { greatVibes } from "@/app/lib/font/fonts";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { useNotification } from "@/app/context/NotificationContext";
import { Great_Vibes } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { makeRequest } from "@/app/lib/helperFunctions";
import { ImCancelCircle } from "react-icons/im";
import { useAuth } from "@/app/context/AuthContext";
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});
export default function VerifyEmail() {
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {updateUser} = useAuth();
  const { showToast } = useNotification();
  
const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;

    hasVerified.current = true; // block future calls

    const verifyEmail = async () => {
      if (!token) {
        setVerified(true);
        setError(true);
        showToast("Invalid URL, or Something happened, Try again !!!", "error");
        return;
      }

      try {
        showToast("Verifying...");
        const response = await makeRequest(
          `/api/users/auth?service=verifyEmail&token=${token}`,
          { method: "GET" }
        );

        if (!response.success) {
          showToast(response.message, "error");
          setError(true);
          setVerified(true);
          return;
        }

        updateUser({ email_verified: true });
        setVerified(true);
        showToast(response.message, "success");

      } catch (error: any) {
        showToast(error.message || "Something went wrong", "error");
        setError(true);
        setVerified(true);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-[#FFD700] p-6">
      <div className="w-full flex flex-col justify-center max-w-md bg-[#2a2a2a] rounded-xl p-6 shadow-lg overflow-hidden">
        <div className="relative flex flex-col justify-center items-center gap-3 w-full h-auto overflow-hidden">
          <h1 className="text-center">
            <span className={`${greatVibes.className} text-3xl`}>craft</span>
            SPACES
          </h1>

          <div className="text-center bg-[#535353] w-full px-4 py-2 rounded-md">
            <p>Email Verification</p>
          </div>
          {verified && !error ? (
            <div>
              <IoCheckmarkDoneCircle className="text-2xl text-green-600" />
            </div>
          ) : error && verified ? (
            <div>
              <ImCancelCircle className="text-2xl text-red-500" />
            </div>
          ) : (
            <div>
              <FormLoading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
