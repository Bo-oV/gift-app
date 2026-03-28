import "../components/giftItem.scss";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/Button/Button";

type Props = {
  title: string;
  description: string;
  link?: string;

  onCancel: () => void;
};

export const GiftItem = ({ title, description, onCancel, link }: Props) => {
  return (
    <div className="gift-item">
      <div className="gift-item__info">
        <h4 className="gift-item__title">{title}</h4>
        <p className="gift-item__desc">{description}</p>
      </div>

      <div className="gift-item__actions">
        {link && (
          <Button
            text="Перейти"
            icon={<ArrowRight size={16} />}
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              window.open(link, "_blank");
            }}
          />
        )}

        <Button
          text="Відмінити"
          icon={<X size={16} />}
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
        />
      </div>
    </div>
  );
};
