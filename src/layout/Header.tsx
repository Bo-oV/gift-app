import { useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import "./header.scss";
import { useUserProfile } from "@/context/useUserProfile";

export const Header = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const location = useLocation();

  const titles: Record<string, string> = {
    "/home": "Мої події",
    "/create-event": "Створити подію",
    "/upcoming": "Майбутні події",
    "/reservations": "Обрані подарунки",
    "/profile": "Профіль",
  };

  const getPhotoKey = (uid: string) => `user_photo_${uid}`;

  const localPhoto =
    profile?.photoURL || (user && localStorage.getItem(getPhotoKey(user.uid)));

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
        <h2 className="header__username">
          {profile?.displayName || user?.displayName || "User"}
        </h2>

        <div className="header__avatar">
          <img
            src={
              localPhoto ||
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${profile?.displayName || user?.displayName || "User"}`
            }
            alt="avatar"
          />
        </div>
      </div>

      <p className="header__title">{pageTitle}</p>
    </header>
  );
};
