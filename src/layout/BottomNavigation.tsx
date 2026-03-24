import { useLocation, useNavigate } from "react-router-dom";
import { Home, History, Gift, User, Plus } from "lucide-react";
import "../layout/bottomNavigation.scss";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav__item ${
          location.pathname === "/home" ? "bottom-nav__item--active" : ""
        }`}
        onClick={() => navigate("/home")}
      >
        <Home size={24} />
      </button>

      <button
        className={`bottom-nav__item ${
          location.pathname === "/upcoming" ? "bottom-nav__item--active" : ""
        }`}
        onClick={() => navigate("/upcoming")}
      >
        <History size={24} />
      </button>

      <button
        className="bottom-nav__create "
        onClick={() => navigate("/create-event")}
        disabled={
          location.pathname === "/create-event" ||
          location.pathname.startsWith("/event") ||
          location.pathname.startsWith("/edit-event")
        }
      >
        <Plus size={28} />
      </button>

      <button
        className={`bottom-nav__item ${
          location.pathname === "/reservations"
            ? "bottom-nav__item--active"
            : ""
        }`}
        onClick={() => navigate("/reservations")}
      >
        <Gift size={24} />
      </button>

      <button
        className={`bottom-nav__item ${
          location.pathname === "/profile" ? "bottom-nav__item--active" : ""
        }`}
        onClick={() => navigate("/profile")}
      >
        <User size={24} />
      </button>
    </nav>
  );
};
