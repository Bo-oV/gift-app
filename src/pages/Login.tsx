import { useLocation, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase/auth";

export const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/home";

  const handleLogin = async () => {
    try {
      await signInWithGoogle();

      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};
