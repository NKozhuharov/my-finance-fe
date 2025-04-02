import {useContext} from "react";
import {UserContext} from "../contexts/UserContext";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 100000
});

export const useLogin = () => {
    const login = async (email, password) =>
        axiosInstance.post(
            'user/login',
            {email, password},
        ).then(function (response) {
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    return {
        login,
    }
};

export const useRegister = () => {
    const register = (first_name, last_name, email, password, password_confirmation) =>
        axiosInstance.post(`user/register`, {first_name, last_name, email, password, password_confirmation})
            .then(function (response) {
                return response.data;
            }).catch(function (error) {
            if (error.response) {
                return error.response.data;
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    return {
        register,
    }
};

export const useLogout = () => {
    const {token, userLogoutHandler} = useContext(UserContext);

    const logout = () => {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        axiosInstance.post(`user/sign-out`)
            .then(userLogoutHandler)
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
    }

    return {
        isLoggedOut: true,
        logout
    };
};
