import { User, users } from '../dummy-data/user-data';

// export const login = async (
//     email: string,
//     password: string
// ) => {
//     const result = await apiFetch('/api/login', {
//         method: 'POST',
//         body: JSON.stringify({
//             email,
//             password,
//         }),
//     });
//     if (result.data?.token) {
//         await SecureStore.setItemAsync('auth_token', result.data.token);
//     }
//     return result;
// };

export const login = async (
    email: string,
    password: string,
) => {
    const trimmedEmail = email.trim().toLowerCase();
    let foundUser: User | null = null;

    for (let i = 0; i < users.length; i++) {
        const item = users[i];
        if (
            item.email.toLowerCase() === trimmedEmail &&
            item.password === password
        ) {
            foundUser = item;
            break;
        }
    }

    if (!foundUser) {
        return {
            success: false,
            message: 'Email atau kata sandi tidak sesuai',
        };
    }

    return {
        success: true,
        message: 'Berhasil masuk',
        datetime: new Date(),
        path: 'api/login',
        data: foundUser,
        token: Math.floor(Math.random() * 10000).toString(),
    };
};

export const register = async (
    name: string,
    email: string,
    password: string,
    extra?: { phone?: string; location?: string }
) => {
    const trimmedEmail = email.trim().toLowerCase();

    let emailExists = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === trimmedEmail) {
            emailExists = true;
            break;
        }
    }

    if (emailExists) {
        return {
            success: false,
            message: 'Email sudah terdaftar',
        };
    }

    const newUser: User = {
        id: users.length + 1,
        name: name.trim(),
        email: trimmedEmail,
        password,
        phone: extra?.phone?.trim() || '-',
        location: extra?.location?.trim() || '-',
    };

    users.push(newUser);

    return {
        success: true,
        message: 'Registrasi berhasil',
        datetime: new Date(),
        path: 'api/register',
        data: newUser,
    };
};
