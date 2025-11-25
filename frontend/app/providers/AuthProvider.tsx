"use client";
import { useUtility } from "./UtilityProvider";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (t: string | null) => void;
  loading: boolean;
  loggedIn: boolean;
  setLoggedIn : (t: boolean)=>void;
  setLoading : (t: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => { },
  loading: true,
  loggedIn: false,
  setLoggedIn : ()=>{},
  setLoading : ()=>{}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { API_URL } = useUtility();

  useEffect(() => {
    async function refresh() {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
          setLoggedIn(true);
        }
      } catch {
        console.log("Error in refresh token");
      } finally {
        setLoading(false);
      }
    }

    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading, loggedIn,setLoggedIn ,setLoading}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
