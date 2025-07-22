import React, { useEffect, useState } from "react";
import FormLoading from "./Loaders/FormLoading";
import { useScroll } from "../context/ScrollContext";
interface SendEmailVerificationProps {
  resendVerificationEmail: () => Promise<void>;
  pending: boolean;
}
const ShowEmailVerificationPopup = ({
  resendVerificationEmail,
  pending,
}: SendEmailVerificationProps) => {
  const { showNavbar, scrolled } = useScroll();

  return (
    <section
      className={`w-full bg-[#2a1314] transition-all mb-4 z-20 duration-300 border-2 border-[#671e21] flex flex-col md:flex-row md:justify-center py-2 px-1 rounded-md gap-3 
       ${showNavbar ? "-translate-y-10" : "-translate-y-32"}`}
    >
      <p className="text-sm text-[#c12e1c] font-sans font-semibold">
        Your email has not been verified yet. Please check your inbox for a
        verification link.
      </p>
      <p className="text-sm text-[#c12e1c] font-bold font-sans ">
        Didn’t get the email?{" "}
        <button
          onClick={resendVerificationEmail}
          className="text-slate-50 hover:underline font-medium mt-3 md:ml-4 md:mt-0 cursor-pointer"
        >
          {pending ? (
            <FormLoading />
          ) : (
            " Click here to resend verification email"
          )}
        </button>
      </p>
    </section>
  );
};

export default ShowEmailVerificationPopup;
