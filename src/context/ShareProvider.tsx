import { useShare } from "@/hooks/useShare";
import { ShareContext } from "./ShareContext";
import { ShareModal } from "@/pages/components/ShareModal";

type Props = {
  children: React.ReactNode;
};

export const ShareProvider = ({ children }: Props) => {
  const share = useShare();

  return (
    <ShareContext.Provider value={share}>
      {children}

      {share.isOpen && (
        <ShareModal link={share.link} onClose={share.closeShare} />
      )}
    </ShareContext.Provider>
  );
};
