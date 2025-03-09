import React, { createContext, useContext, useState, useEffect } from "react";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createServerClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_KEY,
        {
          cookies: {
            getAll() {
              return parseCookieHeader(document.cookie);
            },
            
          },
        }
      );

      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
