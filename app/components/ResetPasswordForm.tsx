"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { greatVibes } from "../lib/font/fonts"; // adjust path if needed
import FormLoading from "./Loaders/FormLoading"; // adjust import if your loading spinner is elsewhere

type ResetPasswordFormInputs = {
  password: string;
};

type ResetPasswordFormProps = {
  onSubmit: (data: ResetPasswordFormInputs) => Promise<void>;
  pending: boolean;
};

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  pending,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResetPasswordFormInputs>();

  return (
    <section className="mt-20 h-screen w-full max-w-md flex flex-col gap-3 items-center">
      <div className="w-full text-center">
        <span
          className={`${greatVibes.className} text-5xl w-full text-center mb-20`}
        >
          craft
        </span>
        SPACES
        <p className="mt-10">Reset Your Password</p>
      </div>

      <div className="w-full bg-[#2a2a2a] rounded-xl p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4 pr-4"
        >
          {/* Old Password */}
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-md hover:bg-yellow-400 transition duration-300 cursor-pointer"
          >
            {pending ? <FormLoading /> : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
