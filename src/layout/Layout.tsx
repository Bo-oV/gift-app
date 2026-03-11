import { Outlet } from "react-router-dom";
import { BottomNavigation } from "./BottomNavigation";
import { useAuth } from "../context/useAuth";
import { Header } from "@/layout/Header";

export const Layout = () => {
  const { user } = useAuth();

  return (
    <div>
      {user && <Header />}
      <main>
        <Outlet />
      </main>

      {user && <BottomNavigation />}
    </div>
  );
};
