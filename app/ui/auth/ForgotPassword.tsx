"use client";

import { greatVibes } from "@/app/lib/font/fonts";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
import React, { useState } from "react";
import FormLoading from "@/app/components/Loaders/FormLoading";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const ForgotPassword = () => {
  const { showToast } = useNotification();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>();
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    try {
      const response = await makeRequest(
        `/api/users/auth?service=sendResetPasswordLink`,
        { method: "POST", body: JSON.stringify({ email }) }
      );
      if (!response.success) {
        setPending(false);
        showToast(response.message, "error");
        return;
      }

      setPending(false);
      setEmail("");
      showToast(response.message, "success");
      setEmailSent(true);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };
  return (
    <main className="mb-auto w-full h-screen flex justify-center">
      {!emailSent ? (
        <section className="mt-30 w-full max-w-md flex flex-col gap-3 items-center">
          <div className="w-full text-center">
            <span
              className={`${greatVibes.className} text-5xl w-full text-center mb-20`}
            >
              craft
            </span>
            SPACES
            <p className="mt-10">Reset Your Password</p>
          </div>
          <div className="w-full  bg-[#2a2a2a] rounded-xl p-6">
            <form onSubmit={handleOnSubmit}>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-amber-400 text-[#1a1a1a] text-center py-2 px-3 w-full font-semibold cursor-pointer rounded-md"
              >
                {pending ? <FormLoading /> : " Send password reset link"}
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className="mt-30 w-full max-w-md flex flex-col gap-3 items-center bg-[#2a2a2a] rounded-xl p-6 h-28">
          <h1>Reset Link Sent</h1>
          <IoCheckmarkDoneCircle className="text-2xl text-green-600" />
        </section>
      )}
    </main>
  );
};

export default ForgotPassword;
