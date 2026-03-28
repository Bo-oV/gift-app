import { useContext } from "react";
import { UserContext } from "./UserContext";

export const useUserProfile = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserProfile must be used inside UserProvider");
  }

  return context;
};
