import "./App.scss";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { EditEvent } from "./pages/EditEvent";
import { CreateEvent } from "./pages/CreateEvent";
import { MyReservations } from "./pages/MyReservations";
import { Toaster } from "react-hot-toast";
import { Profile } from "./pages/Profile";

import { Layout } from "./layout/Layout";
import { EventPage } from "./pages/EventPage";
import { Upcoming } from "./pages/Upcoming";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppLoader } from "./pages/components/AppLoader";
import { App as CapApp } from "@capacitor/app";
import { useEffect } from "react";
function App() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const listener = CapApp.addListener("appUrlOpen", (event) => {
      console.log("URL:", event.url);

      if (event.url.includes("sviato.vercel.app")) {
        navigate("/home", { replace: true });
      }
    });

    return () => {
      listener.remove();
    };
  }, [navigate]);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />

          <Route path="/event/:eventId" element={<EventPage />} />

          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-event/:eventId"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upcoming"
            element={
              <ProtectedRoute>
                <Upcoming />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <MyReservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      <Toaster position="top-right" />
      <div className="background">
        <div className="background__circle background__circle--top"></div>
        <div className="background__circle background__circle--mid"></div>
        <div className="background__circle background__circle--bottom"></div>
      </div>
    </div>
  );
}

export default App;
