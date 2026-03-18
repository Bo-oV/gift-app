import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { useAuth } from "../context/useAuth";
import { Header } from "@/layout/Header";
import "./layout.scss";

export const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="layout">
      {user && <Header />}

      <main className="layout__content">
        <Outlet />
      </main>

      {user && <BottomNavigation />}
    </div>
  );
};
