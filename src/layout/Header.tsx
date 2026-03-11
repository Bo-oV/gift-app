import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/useAuth";
import { auth } from "../firebase/auth";

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header>
      <h2>Gift Planner</h2>

      {user && <button onClick={handleLogout}>Logout</button>}
    </header>
  );
};
