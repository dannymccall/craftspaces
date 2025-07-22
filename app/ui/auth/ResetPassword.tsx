"use client";

import React, { useEffect, useState } from "react";
import { greatVibes } from "@/app/lib/font/fonts";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useSearchParams } from "next/navigation";
import { useNotification } from "@/app/context/NotificationContext";
import Link from "next/link";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import ResetPasswordForm from "@/app/components/ResetPasswordForm";


const ResetPassword = () => {
  const [pending, setPending] = useState<boolean>(false);
  const [resetComplete, setResetComplete] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { showToast } = useNotification();

  useEffect(() => {
    if (!token) {
      showToast("Invalid URL", "error");
      return;
    }
  }, []);

  async function onResetSubmit(data: {
    password: string
  }) {
    console.log({data})
    try {
        setPending(true);
      const response = await makeRequest(
        `/api/users/auth?service=resetPassword&token=${token}`,
        { method: "PUT", body: JSON.stringify(data) }
      );
      if (!response.success) {
        setPending(false);
        showToast(response.message, "error");
        return;
    }
    setResetComplete(true);
      showToast(response.message, "success");
      setPending(false);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  }

  const goToLoginPage = () => (
    <>
      <main className="mb-auto w-full h-screen  flex justify-center">
        <section className="mt-20 h-screen w-full max-w-md flex flex-col gap-3 items-center">
          <div className="w-full text-center">
            <span
              className={`${greatVibes.className} text-5xl w-full text-center mb-20`}
            >
              craft
            </span>
            SPACES
            <div className="w-full flex justify-center">
              <p className="mt-10 flex flex-row gap-3">
                Reset Complete{" "}
                <IoCheckmarkDoneCircle className="text-2xl text-green-600" />
              </p>
            </div>
          </div>

          <Link
            href={"/auth/auth-page"}
            className="bg-amber-400 text-[#1a1a1a] text-center py-2 px-3 w-full font-semibold cursor-pointer rounded-md"
          >
            Go To Signin
          </Link>
        </section>
      </main>
    </>
  );

  return (
    <main className="mb-auto w-full h-screen  flex justify-center">
      {resetComplete ? (
        goToLoginPage()
      ) : (
        <ResetPasswordForm pending={pending} onSubmit={onResetSubmit} />
      )}
    </main>
  );
};

export default ResetPassword;
