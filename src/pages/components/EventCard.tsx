import type { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Props = {
  id: string;
  title: string;
  date: Timestamp;
};

export const EventCard = ({ id, title, date }: Props) => {
  const navigate = useNavigate();

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const link = `${window.location.origin}/event/${id}`;
    await navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-event/${id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/event/${id}`)}
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "12px",
        cursor: "pointer",
      }}
    >
      <h3>{title}</h3>

      <p>{date.toDate().toLocaleDateString()}</p>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleCopyLink}>Copy</button>

        <button onClick={handleEdit}>Edit</button>
      </div>
    </div>
  );
};
