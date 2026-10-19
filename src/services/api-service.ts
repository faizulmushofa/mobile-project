import { API_URL } from '../constants/api';
import * as SecureStore from 'expo-secure-store';

export const apiFetch = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    const token = await SecureStore.getItemAsync('auth_token');

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,

        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',

            ...(token && {
                Authorization: `Bearer ${token}`,
            }),

            ...options.headers,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        const message = result.message || Object.values(result.errors || {}).flat().join(' ') || 'Request gagal.';
        throw new Error(message);
    }

    return result;
};