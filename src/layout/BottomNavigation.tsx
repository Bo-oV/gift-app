import { useLocation, useNavigate } from "react-router-dom";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <button
        onClick={() => navigate("/home")}
        disabled={location.pathname === "/home"}
      >
        Home
      </button>
      <button
        onClick={() => navigate("/upcoming")}
        disabled={location.pathname === "/upcoming"}
      >
        Upcoming
      </button>
      <button
        onClick={() => navigate("/reservations")}
        disabled={location.pathname === "/reservations"}
      >
        Reservations
      </button>

      <button
        onClick={() => navigate("/profile")}
        disabled={location.pathname === "/profile"}
      >
        Profile
      </button>
    </div>
  );
};
