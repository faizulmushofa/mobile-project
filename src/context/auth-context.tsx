import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface RegisterExtraData {
  phone?: string;
  location?: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initializing: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; data?: any }>;
  register: (
    fullName: string,
    email: string,
    password: string,
    extra?: RegisterExtraData
  ) => Promise<{ success: boolean; message?: string; data?: any }>;
  logout: () => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[AuthContext] Gagal memulihkan sesi:", error.message);
        }
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error("[AuthContext] Error saat restoreSession:", err);
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setInitializing(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        let errorMsg = error.message;
        if (error.message.includes("Invalid login credentials")) {
          errorMsg = "Email atau kata sandi tidak valid. Silakan periksa kembali.";
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          errorMsg =
            "Email belum dikonfirmasi! Harap nonaktifkan 'Confirm email' di Dashboard Supabase (Authentication -> Providers -> Email) atau klik tautan verifikasi di email Anda.";
        }
        return { success: false, message: errorMsg };
      }

      setSession(data.session);
      setUser(data.user);
      return { success: true, data: data.user };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Terjadi kesalahan saat masuk.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    extra?: RegisterExtraData
  ) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: extra?.phone?.trim() ?? "",
            location: extra?.location?.trim() ?? "",
            role: extra?.role ?? "petani",
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      await supabase.auth.signOut();
      setSession(null);
      setUser(null);

      return {
        success: true,
        message: "Akun berhasil terdaftar!",
        data: data.user,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Terjadi kesalahan saat pendaftaran.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      console.warn(err);
    } finally {
      setSession(null);
      setUser(null);
      setLoading(false);
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        initializing,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam <AuthProvider />");
  }
  return context;
};
