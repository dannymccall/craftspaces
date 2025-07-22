import React, { Ref, RefObject } from "react";
import Image from "next/image";
import { FaUserLarge } from "react-icons/fa6";
import { IoIosCamera } from "react-icons/io";
// import Modal from "./Modal";
// import ImageComponent from "./ImageComponent";
import ImageComponent from "../Image";
import Modal from "../Modal";
import { IoIosArrowForward } from "react-icons/io";
import { useLogout } from "@/app/hooks/useLogout";
import { useRouter } from "next/navigation";
interface ProfileAvatarProps {
  avarta: string | null;
  handleClick: () => void;
  fileInputRef: Ref<HTMLInputElement>;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avarta,
  handleClick,
  fileInputRef,
  handleImageUpload,
}) => (
  <section className="w-full flex justify-center mb-5">
    <div
      className="relative mt-8 border-2  border-white rounded-full h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 cursor-pointer"
      onClick={handleClick}
    >
      {avarta ? (
        process.env.NEXT_PUBLIC_NODE_ENV !== "development" ? (
          <ImageComponent
            src={avarta}
            className="rounded-full w-full h-full border-white"
          />
        ) : (
          <Image
            src={`/uploads/${avarta}`}
            width={100}
            height={100}
            alt="Profile image"
            className="rounded-full w-full h-full border-white"
          />
        )
      ) : (
        <div className="w-full h-full bg-gray-800 rounded-full flex justify-center items-center">
          <FaUserLarge size={40} />
        </div>
      )}
      <IoIosCamera
        className="absolute top-20 sm:top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10"
        size={25}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  </section>
);

interface UserInfoProps {
  user: {
    name?: string;
    email?: string;
  };
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => (
  <div className="w-full">
    <div className="flex flex-col items-center gap-2 ">
      <h1 className="font-semibold text-sm sm:text-base">{user?.name}</h1>
      <h1 className="font-semibold text-sm sm:text-base">{user?.email}</h1>

      {/* <p className="border px-3 sm:px-5 py-1 rounded flex items-center gap-2 sm:gap-3 text-sm">
        <span
          className={`h-3 w-3 rounded-full ${
            user?.online_status === "online" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {user?.online_status === "online" ? "Available" : "Not Available"}
      </p> */}
    </div>
    {/* <span className="text-gray-500 font-semibold text-sm sm:text-base">
      {user?.roles?.toString()}
    </span> */}
  </div>
);

interface TabButtonsProps {
  tabs: { label: string; content: React.ReactNode }[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => (
  <div className="mx-auto flex flex-wrap justify-center gap-2 mt-5">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => setActiveTab(index)}
        className={`tab font-mono h-12 px-4 transition duration-300 text-sm sm:text-base ${
          activeTab === index
            ? "text-violet-700 font-semibold border-b-2 border-violet-700"
            : "hover:bg-gray-300"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);


type ProfileButtonsProps = {
  handleLogout: () => void;
  onClickAccountSettings: () => void
}
const ProfileButtons = ({handleLogout, onClickAccountSettings}:ProfileButtonsProps) => {

  const router = useRouter();
  return (
    <section className="w-full px-10 mt-20">
      <div className="w-full flex flex-col divide-y divide-neutral-700 rounded-md overflow-hidden bg-neutral-800">
        <button className="w-full flex justify-between items-center hover:bg-neutral-700 p-5 transition-all duration-300 cursor-pointer" onClick={() => router.push("/shop/my-orders")}>
          Orders
          <IoIosArrowForward />
        </button>

        <button className="w-full flex justify-between items-center hover:bg-neutral-700 p-5 transition-all duration-300 cursor-pointer" onClick={onClickAccountSettings}>
          Account Settings
          <IoIosArrowForward />
        </button>

        <button className="w-full flex justify-between items-center text-red-400 hover:bg-red-900 p-5 transition-all duration-300 cursor-pointer" onClick={handleLogout}>
          Logout
          <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
};

interface PhotoUploadModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  message: { showMessage: boolean; messageType: string; message: string };
  useProfilePhoto: (e: React.FormEvent<HTMLFormElement>) => void;
  formRef: Ref<HTMLFormElement>;
  profileImage: string;
  handleClick: () => void;
  pending: boolean;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  modalOpen,
  setModalOpen,
  message,
  useProfilePhoto,
  formRef,
  profileImage,
  handleClick,
  pending,
}) => (
  <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
    <div className="w-full flex flex-col gap-5 items-center">
      {message.showMessage && message.messageType === "errorMessage" && (
        <p className="w-11/12 sm:w-2/3 text-red-500 p-2 text-sm sm:text-base font-semibold text-center bg-red-200 m-4 border-2 border-red-600 rounded-md">
          {message.message}
        </p>
      )}
      <form
        method="post"
        className="w-full flex flex-col gap-5 items-center"
        onSubmit={useProfilePhoto}
        ref={formRef}
      >
        <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32">
          <Image
            src={profileImage}
            alt="profile-img"
            className="rounded-full w-full h-full border-white"
            width={100}
            height={100}
          />
        </div>
        <div className="flex gap-3 sm:gap-5">
          <button className="btn btn-sm bg-violet-600 text-white" type="submit">
            {pending && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            Use Picture
          </button>
          <button
            className="btn btn-sm btn-error text-white"
            onClick={handleClick}
            type="button"
            disabled={pending}
          >
            Select Another
          </button>
        </div>
      </form>
    </div>
  </Modal>
);

interface UserProfileSectionProps {
  avarta: string | null;
  fileInputRef: Ref<HTMLInputElement>;
  handleClick: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  user: {
    name?: string;
    email?: string;
  };
  // tabs: { label: string; content: React.ReactNode }[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  message: { showMessage: boolean; messageType: string; message: string };
  useProfilePhoto: (e: React.FormEvent<HTMLFormElement>) => void;
  formRef: Ref<HTMLFormElement>;
  profileImage: string;
  pending: boolean;
  handleLogout: () => void;
  onClickAccountSettings: () => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  avarta,
  fileInputRef,
  handleClick,
  handleImageUpload,
  user,
  // tabs,
  activeTab,
  setActiveTab,
  modalOpen,
  setModalOpen,
  message,
  useProfilePhoto,
  formRef,
  profileImage,
  pending,
  handleLogout,
  onClickAccountSettings
}) => (
  
 <section className="w-full flex gap-5 p-5 mt-20 justify-center h-screen sm:p-10 relative">
  <div className="bg-neutral-900 w-full h-full shadow-2xl rounded-md md:w-[500px] min-h-96 relative">
    <div className="w-full relative">
      <ProfileAvatar
        avarta={avarta}
        handleClick={handleClick}
        fileInputRef={fileInputRef}
        handleImageUpload={handleImageUpload}
      />
    </div>

    {/* 🔽 Divider before user info */}

    <UserInfo user={user} />
    <div className="border-t border-neutral-700 my-4 mx-5" />
    <ProfileButtons handleLogout={handleLogout} onClickAccountSettings={onClickAccountSettings}/>
  </div>

  <PhotoUploadModal
    modalOpen={modalOpen}
    setModalOpen={setModalOpen}
    message={message}
    useProfilePhoto={useProfilePhoto}
    formRef={formRef}
    profileImage={profileImage}
    handleClick={handleClick}
    pending={pending}
  />
</section>

);

export default UserProfileSection;
