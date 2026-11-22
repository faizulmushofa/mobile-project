import { useState } from "react";
import { login, logout, register } from "../services/auth-service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      return await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    extra?: { phone?: string; location?: string },
  ) => {
    setLoading(true);
    try {
      return await register(name, email, password, extra);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true);
    try {
      if (typeof logout === "function") {
        await logout();
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loading,
  };
};
