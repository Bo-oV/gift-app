import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  completeGoogleRedirectSignIn,
  hasPendingGoogleRedirectSignIn,
} from "../firebase/auth";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { createUserIfNotExists } from "../firebase/firestore";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [redirectReady, setRedirectReady] = useState<boolean>(
    !hasPendingGoogleRedirectSignIn(),
  );

  useEffect(() => {
    let isMounted = true;

    completeGoogleRedirectSignIn()
      .catch((error) => {
        console.error("Google redirect sign-in failed:", error);
      })
      .finally(() => {
        if (isMounted) {
          setRedirectReady(true);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          await createUserIfNotExists(currentUser);
        } catch (error) {
          console.error("User creation failed:", error);
        }
      }

      if (isMounted) {
        setAuthReady(true);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const loading = !authReady || !redirectReady;

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
