"use client";

import React, { useState } from "react";
import { addUserSchema } from "@/app/lib/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotification } from "@/app/context/NotificationContext";
import { z } from "zod";
import { makeRequest } from "@/app/lib/helperFunctions";
import FormLoading from "@/app/components/Loaders/FormLoading";

type addUser = z.infer<typeof addUserSchema>;
export default function AddUser() {
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<addUser>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { name: "", email: "" },
  });
  const { showToast } = useNotification();
  const [pending, setPending] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    setPending(true);
    try {
      const res = await makeRequest("/api/users/addUser", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.success) {
        showToast(res.message, "success");
        setPending(false);
        reset()
      }else{
        showToast(res.message, "error");
        setPending(false)
      }
    } catch (error: any) {
      setPending(false);
      showToast(error.message, "error");
    }
    // Add submission logic here
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#FFD700] p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-[#2a2a2a] rounded-xl p-6 shadow-lg mt-20">
        <h2 className="text-2xl font-bold mb-6">Add New User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-3"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="text"
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-3"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Role</label>
            <select
              {...register("role")}
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-3"
            >
              <option value="">Select a Role</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">
                {errors.role.message as string}
              </p>
            )}
          </div>

          <button
            disabled={pending}
            className="w-full py-3 bg-[#FFD700] text-black font-bold disabled:bg-gray-500 rounded-md hover:bg-yellow-400 transition duration-300 cursor-pointer"
          >
            {pending ? (
              <FormLoading />
            ) : (
              "Save User"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
