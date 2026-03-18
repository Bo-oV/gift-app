import { useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./header.scss";

export const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  const titles: Record<string, string> = {
    "/home": "Мої події",
    "/create-event": "Створити подію",
    "/upcoming": "Майбутні події",
    "/reservations": "Обрані подарунки",
    "/profile": "Профіль",
  };
  console.log(user);

  let pageTitle = titles[location.pathname] || "";

  if (location.pathname.startsWith("/event")) {
    pageTitle = "Подія";
  }

  if (location.pathname.startsWith("/edit-event")) {
    pageTitle = "Редагувати подію";
  }
  return (
    <header className="header">
      <div className="header__info">
        <h2 className="header__username">{user?.displayName}</h2>
        <div className="header__avatar">
          <img
            src={user?.photoURL?.replace("=s96-c", "=s200-c")}
            alt="avatar"
          />
        </div>
      </div>

      <p className="header__title">{pageTitle}</p>
    </header>
  );
};
