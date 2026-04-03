import { useLocation, useNavigate } from "react-router-dom";
import { auth, signInWithGoogle } from "../firebase/auth";
import { GoogleButton } from "../components/Button/GoogleButton";
import { Capacitor } from "@capacitor/core";
import "./login.scss";
import { useEffect, useState } from "react";
import { getRedirectResult } from "firebase/auth";

export const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("WEB LOGIN SUCCESS");
          navigate("/home", { replace: true });
        }
      })
      .catch(console.error);
  }, []);

  const from = location.state?.from?.pathname || "/home";

  const handleLogin = async () => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 600));

      await signInWithGoogle();

      if (Capacitor.isNativePlatform()) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__content">
        <h1 className="login__title">УВІЙТИ</h1>

        <p className="login__subtitle">АБО СТВОРИТИ АККАУНТ</p>

        <GoogleButton onClick={handleLogin} disabled={loading} />
      </div>
    </div>
  );
};
