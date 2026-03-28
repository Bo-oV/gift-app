import { useState } from "react";

export const useShare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [link, setLink] = useState("");

  const openShare = (eventId: string) => {
    if (!eventId) return;
    const generatedLink = `${window.location.origin}/event/${eventId}`;
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
