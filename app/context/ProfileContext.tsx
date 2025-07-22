import { createContext, useContext, useEffect, useState } from "react";
import { makeRequest } from "../lib/helperFunctions";
import { useUser } from "../hooks/useUser";
import { User } from "../lib/types/User";
interface ProfileContextType {
  profilePicture: string;
  updateProfilePicture: (newPicture: string) => void;
  user: User
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [profilePicture, setProfilePicture] = useState<string>("");
 
  console.log(user)
  useEffect(() => {
    if (user && user.avatar) {
      setProfilePicture(user.avatar);
    }
  }, [user]);

  const updateProfilePicture = (newPicture: string) => {
    setProfilePicture(newPicture);
  };

  return (
    <ProfileContext.Provider value={{ profilePicture, updateProfilePicture,user }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
