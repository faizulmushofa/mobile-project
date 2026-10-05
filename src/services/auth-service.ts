import * as SecureStore from 'expo-secure-store';
import {apiFetch} from './api-service';
import { users} from '../dummy-data/user-data'

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
//         await SecureStore.setItemAsync(
//             'auth_token',
//             result.data.token
//         );
//     }

//     return result;
// };

export const login = async (
    email: string,
    password: string,
) => {
    
    let user = null;
    
    users.forEach( user => {
        if(user.email == email && user.password == password) {
            user = user;
        }
    });

    if (!user) {
        return {
            message : 'Data User Tidak Ditemukan'
        }
    }
    return {
        message : "success",
        datetime : new Date(),
        path : "api/login",
        data : user,
        token : Math.floor(Math.random() * 10000)
    };

}

// export const register = async (name: string, email: string, password: string) => {
//     return apiFetch('/api/register', {
//         method: 'POST',

//         body: JSON.stringify({
//             name,
//             email,
//             password,
//         }),
//     });
// };

export const register = async (name: string, email: string, password: string) => {

    if (users.find(user => user.email === email)) {
        return {
            message : 'Email Sudah Terdaftar'
        }
    }

    const newUser = {
        name : name,
        email : email,
        password : password
    }

    users.push(newUser);

    return {
        message : "success",
        datetime : new Date(),
        path : "api/register",
        data : newUser
    }
}
    
