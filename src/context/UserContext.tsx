import { createContext, useContext, useState } from "react";

type Profile = {
  displayName?: string;
  photoURL?: string | null;
};

type UserContextType = {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserProfile must be used inside UserProvider");
  return context;
};
