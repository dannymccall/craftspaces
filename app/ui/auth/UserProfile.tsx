"use client";
import React, {
  useCallback,
  useEffect,
  useState,
  lazy,
  Suspense,
  useRef,
} from "react";
import { makeRequest } from "@/app/lib/helperFunctions";
// import { ChangePasswordTemplate } from "@/app/component/users/ProfileInfomation";

import { CustomFile, User } from "@/app/lib/types/User";
import { blobToFile } from "@/app/lib/helperFunctions";
import { FaCircleCheck } from "react-icons/fa6";
import ProfileImage from "@/public/profile.jpg";
import { useProfile } from "@/app/context/ProfileContext";
import { useUser } from "@/app/hooks/useUser";
import { useLogout } from "@/app/hooks/useLogout";
// import ProfileSkeleton from "@/app/component/Loaders/ProfileSkeleton";

import UserProfileSection from "@/app/components/userProfile/UserProfileSection";
import ProfileSkeleton from "@/app/components/Loaders/ProfileSkeleton";
import UserProfileSettings from "@/app/components/userProfile/UserProfileSettings";
// const ContactInformation = lazy(
//   () => import("@/app/component/users/ProfileInfomation")
// );
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string | any>(ProfileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [avarta, setAvarta] = useState<string>("");
  const {handleLogout} = useLogout()
  const [userProfile, setUserProfile] = useState<User>()
  const [message, setMessage] = useState<{
    showMessage: boolean;
    message: string;
    messageType: string;
  }>({ showMessage: false, message: "", messageType: "" });

  const { profilePicture, updateProfilePicture } = useProfile();
 let {user} = useUser()
  console.log(user)
 
  useEffect(() => {
    console.log({ user });
    if(user) setUserProfile(user)
  }, [user]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      // const reader = new FileReader();
      const fileUrl: CustomFile | any = URL.createObjectURL(file);
      setProfileImage(fileUrl);
      setModalOpen(true);
      // console.log(fileUrl);
      // reader.onloadend = () => {
      //   // You can also upload the file to the server here
      // };

      // reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  // const tabs = [
  //   {
  //     label: "Personal Information",
  //     content: <ContactInformation user={user} />,
  //   },
  //   {
  //     label: "Security",
  //     content: <ChangePasswordTemplate username={user ? user.username : ""} />,
  //   },
  // ];

  async function useProfilePhoto(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const profilePicture = await blobToFile(profileImage, "profile-image");
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    if (profilePicture) {
      formData.append("profile-picture", profilePicture);
    }
    const response = await makeRequest(`/api/users/auth?id=${user.id}&service=changeProfilePicture`, {
      method: "PUT",
      body: formData,
    });
    // console.log(response);
    if (!response.success) {
      setPending(false);
      setMessage({
        showMessage: true,
        message: response.message,
        messageType: "errorMessage",
      });
      return;
    }
    setAvarta(response.data);
    updateProfilePicture(response.data);
    setModalOpen(false);
    setPending(false);
    setMessage({
      showMessage: true,
      message: response.message,
      messageType: "successMessage",
    });
    let timeOut: NodeJS.Timeout;
    timeOut = setTimeout(() => {
      setMessage({ showMessage: false, messageType: "", message: "" });
    }, 1000);

    return () => clearTimeout(timeOut);
  }

  const onClickAccountSettings = () => {
    setIsOpen(true); 
  }

  const onUpdate = (newUser:User) => {
    console.log(newUser)
    setUserProfile(newUser)
  }
  return (
    <main className="min-w-full relative">
      {/* {message.showMessage && message.messageType === "successMessage" && (
        <Toast message={message.message} Icon={FaCircleCheck} title="" />
      )} */}
      <UserProfileSettings user={user} isOpen={isOpen} setIsOpen={setIsOpen} onUpdate={onUpdate}/>
      {userProfile ? (
        <UserProfileSection
          avarta={userProfile?.avatar!}
          fileInputRef={fileInputRef}
          formRef={formRef}
          handleClick={handleClick}
          handleImageUpload={handleImageUpload}
          user={userProfile!}
          // tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          message={message}
          profileImage={profileImage}
          pending={pending}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          useProfilePhoto={useProfilePhoto}
          handleLogout={handleLogout}
          onClickAccountSettings={onClickAccountSettings}
        />
      ) : (
        <>
         <ProfileSkeleton />
        </>
      )}
    </main>
  );
};

export default UserProfile;
