"use client";

import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { addProductSchema } from "@/app/lib/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { blobToFile, makeRequest } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
import FormLoading from "@/app/components/Loaders/FormLoading";
import Image from "next/image";
type addProduct = z.infer<typeof addProductSchema>;

export default function AddProduct() {
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const { showToast } = useNotification();
  let formData = new FormData();
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<addProduct>({
    resolver: zodResolver(addProductSchema),
    defaultValues: { title: "", description: "", price: "" },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const file = e.target.files?.[0]; // Get the selected file
    // console.log(file);
    if (file) {
      // Create a URL for the file and update the stat
      const fileUrl = URL.createObjectURL(file);
      setImage(fileUrl);
    }
  };

  const onSubmit = async (data: any) => {
    console.log({ ...data });
    setPending(true);
    if (!image) {
      setImageError("Please Image Required");
      return;
    }
    const fields = ["title", "description", "price", "category"];

    fields.map((field) => {
      formData.set(field, data[field]);
    });

    console.log(image);

    const avarta: any = await blobToFile(image, "avarta");
    formData.set("avarta", avarta);
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    try {
      const result = await makeRequest(`/api/products/productRegistry`, {
        method: "POST",
        body: formData,
      });
      if (!result.success) {
        setPending(false);
        showToast(result.message, "error");
        return;
      }

      setPending(false);
      showToast(result.message, "success");
      reset();
    } catch (error: any) {
      console.log(error);
    }
    // Add submission logic here
  };

  const categories: string[] = [
    "Interior Design",
    "Kitchen Units",
    "Built-in & walk in closets",
    "Bedroom Suites",
    "Kids & Babies furniture",
    "Dinning room suites",
    "Outdoor Furniture",
    "Hotel & Spa Furniture",
    "Coffee Tables",
  ];
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#FFD700] p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-[#2a2a2a] rounded-xl p-6 shadow-lg mt-20">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2">Upload Image</label>
            <div className="border-2 border-dashed border-[#FFD700] p-4 rounded-md bg-[#1f1f1f] text-center cursor-pointer mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="upload"
                // {...register("file")}
              />
              <label
                htmlFor="upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FiUpload size={24} />
                <span className="mt-2">Click to upload</span>
              </label>
            </div>
            {image && (
              <Image
                src={image}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-md"
                width={100}
                height={100}
              />
            )}
            {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Product Title</label>
            <input
              type="text"
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-3"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              type="text"
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-3"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">
                {errors.price.message as string}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <select
              {...register("category")}
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-3"
            >
              <option value="">Select a category</option>
              {categories.map((category, _index) => (
                <option value={category} key={_index}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">
                {errors.category.message as string}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-3"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message as string}
              </p>
            )}
          </div>

          <button className="w-full py-3 bg-[#FFD700] text-black font-bold disabled:bg-gray-500 rounded-md hover:bg-yellow-400 transition duration-300">
            {pending ? <FormLoading /> : "Submit Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
