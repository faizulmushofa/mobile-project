import { useState } from 'react';
import { login, register } from '../services/auth-service';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        try {
            return await login(email, password);
        } catch (error) {
            return { success: false, message: error instanceof Error ? error.message : 'Gagal masuk.' };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (
        name: string,
        email: string,
        password: string,
        extra?: { phone?: string; location?: string }
    ) => {
        setLoading(true);
        try {
            const result = await register(name, email, password, extra);
            return { ...result, success: true };
        } catch (error) {
            return { success: false, message: error instanceof Error ? error.message : 'Gagal mendaftar.' };
        } finally {
            setLoading(false);
        }
    };

    return {
        login: handleLogin,
        register: handleRegister,
        loading,
    };
};