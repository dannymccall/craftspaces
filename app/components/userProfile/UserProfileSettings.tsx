import React, { useEffect, useState } from "react";
import SidebarComponent from "../SidebarComponent";
import { User } from "@/app/lib/types/User";
import FormLoading from "../Loaders/FormLoading";
import ChangePassword from "../ChangePassword";
import { IoMdClose } from "react-icons/io";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
interface UserProfileSettingsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User;
  onUpdate: (user:User) => void
}

type ChangeUserDetails = {
  name: string;
};
const UserProfileSettings = ({
  isOpen,
  setIsOpen,
  user,
  onUpdate
}: UserProfileSettingsProps) => {
  const [pending, setPending] = useState<boolean>(false);
  const { showToast } = useNotification();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangeUserDetails>({
    defaultValues: { name: user && user.name },
  });


  useEffect(() => {
    if(user){
      reset({name: user.name})
    }
  },[user])
  const onSubmit = async (data: any) => {
    setPending(true);

    try {
      const response = await makeRequest(
        "/api/users/auth?service=changeUserDetails",
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
      onUpdate(response.updatedUser[0])
      router.refresh()
    } catch (error: any) {
      showToast(error.message, "error");
      setPending(false);
    }
  };
  return (
    <SidebarComponent setIsOpen={setIsOpen} isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="md:text-3xl text-xl font-bold text-amber-400 mb-6">
          User Settings
        </h1>
        <div className="flex justify-end mb-4">
          <IoMdClose
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-100 hover:text-neutral-800 transition-all duration-300 cursor-pointer rounded-full"
            size={25}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Full Name</label>
          <input
            type="text"
            className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] mb-3"
            // defaultValue={user && user.name}
            {...register("name", { required: "Name cannot be empty" })}
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
            //   {...register("price")}
            defaultValue={user && user.email}
            disabled
          />
          {/* {errors.price && (
              <p className="text-red-500 text-sm">
                {errors.price.message as string}
              </p>
            )} */}
        </div>
        <button
          className="w-full py-3 bg-[#FFD700] text-black font-bold disabled:bg-gray-500 rounded-md hover:bg-yellow-400 transition duration-300"
          disabled={pending}
        >
          {pending ? <FormLoading /> : "Update"}
        </button>
      </form>

      <div className="w-full h-0.5 bg-amber-400 mt-10"></div>
      <ChangePassword />
    </SidebarComponent>
  );
};

export default UserProfileSettings;
