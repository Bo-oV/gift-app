import { useState } from "react";
import { getEventShareLink } from "@/utils/getEventShareLink";

export const useShare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState("");

  const openShare = (eventId: string) => {
    if (!eventId) return;
    const generatedLink = getEventShareLink(eventId);
    setLink(generatedLink);
    setIsOpen(true);
  };

  const closeShare = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    link,
    openShare,
    closeShare,
  };
};
