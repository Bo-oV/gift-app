import { createContext } from "react";

export type Profile = {
  displayName?: string;
  photoURL?: string | null;
};

export type UserContextType = {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);
