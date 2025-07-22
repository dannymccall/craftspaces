"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { greatVibes } from "../lib/font/fonts"; // adjust path if needed
import FormLoading from "./Loaders/FormLoading"; // adjust import if your loading spinner is elsewhere
import { makeRequest } from "../lib/helperFunctions";
import { useNotification } from "../context/NotificationContext";
type ResetPasswordFormInputs = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordFormProps = {};

const ChangePassword: React.FC<ResetPasswordFormProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResetPasswordFormInputs>();
  const [pending, setPending] = useState<boolean>(false);
  const { showToast } = useNotification();


  const onSubmit = async (data: any) => {
    setPending(true);

    try {
      const response = await makeRequest(
        "/api/users/auth?service=changePassword",
        { method: "PUT", body: JSON.stringify(data) }
      );
      console.log({ response });
      if (!response.success) {
        setPending(false);
        showToast(response.message, "error");
        return;
      }

      setPending(false);
      showToast(response.message, "success");
      reset();
    } catch (error: any) {
      showToast(error.message, "error");
      setPending(false);
    }
  };
  return (
    <section className="h-screen w-full  flex flex-col">
      <div className="w-full">
        <p className="md:text-3xl text-xl font-bold text-amber-400 mb-2 mt-10">
          Change Password
        </p>
      </div>

      <div className="w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4 pr-4"
        >
          {/* Old Password */}
          <div>
            <label className="block mb-1">Old Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
              {...register("oldPassword", {
                required: "Old password is required",
              })}
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
              {...register("newPassword", {
                required: "New password is required",
              })}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#FFD700] text-black disabled:bg-neutral-500 font-bold rounded-md hover:bg-yellow-400 transition duration-300 cursor-pointer"
            disabled={pending}
          >
            {pending ? <FormLoading /> : "Change Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
