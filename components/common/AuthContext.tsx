"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  login: (newToken: string, userId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string, userId: string) => {
    debugger;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    router.push(`/users/${userId as string}`);
  };

  console.log(token, " in the auth provider this is the token");

  const logout = async () => {
    try {
      await fetch("/api/users/auth/log-out", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      setToken(null);
      router.push("/users/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    debugger;
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
