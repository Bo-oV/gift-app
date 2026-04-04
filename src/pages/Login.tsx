import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase/auth";
import { GoogleButton } from "../components/Button/GoogleButton";
import { useAuth } from "../context/useAuth";
import { toast } from "react-hot-toast";

import "./login.scss";

export const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/home";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, user]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 600));

      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося увійти через Google");
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
