import { createContext, useContext } from "react";

type ShareContextType = {
  openShare: (eventId: string) => void;
  closeShare: () => void;
  isOpen: boolean;
  link: string;
};

export const ShareContext = createContext<ShareContextType | null>(null);

export const useShareContext = () => {
  const context = useContext(ShareContext);

  if (!context) {
    throw new Error("useShareContext must be used within ShareProvider");
  }

  return context;
};
