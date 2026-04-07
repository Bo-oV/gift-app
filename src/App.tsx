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
import { useEffect } from "react";

function App() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let removeListener: (() => Promise<void>) | undefined;
    const capacitorApp = (
      window as Window & {
        Capacitor?: {
          Plugins?: {
            App?: {
              addListener?: (
                eventName: string,
                listener: (event: { url: string }) => void,
              ) => Promise<{ remove: () => Promise<void> }>;
            };
          };
        };
      }
    ).Capacitor?.Plugins?.App;

    if (capacitorApp?.addListener) {
      void capacitorApp.addListener("appUrlOpen", (event) => {
        if (event.url.includes("sviato.vercel.app")) {
          navigate("/home", { replace: true });
        }
      }).then((listener) => {
        removeListener = () => listener.remove();
      });
    }

    return () => {
      void removeListener?.();
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
