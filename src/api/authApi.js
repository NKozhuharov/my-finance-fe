import {useContext, useEffect} from "react";
import {UserContext} from "../contexts/UserContext";
import axios from "axios";

// const baseUrl = 'https://myf.netcube.eu/api';
const baseUrl = 'http://local.my-finance.com/api';

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 100000,
    headers: {'X-Custom-Header': 'foobar'}
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
    const register = (email, password) =>
        axiosInstance.post(`register`, {email, password});

    return {
        register,
    }
};

export const useLogout = () => {
    const {token, userLogoutHandler} = useContext(UserContext);

    useEffect(() => {
        if (!token) {
            return;
        }

        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };

        axiosInstance.post(`logout`, null, options)
            .then(userLogoutHandler);

    }, [token, userLogoutHandler]);

    return {
        isLoggedOut: !!token,
    };
};
