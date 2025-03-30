import {useEffect, useState} from "react";
import {useApiClient} from "../hooks/useApiClient.js";

export const useWalletIcons = () => {
    const [walletIcons, setWalletIcons] = useState([]);

    const api = useApiClient();

    useEffect(() => {
        const fetchWalletIcons = async () => {
            try {
                const response = await api.get(`/wallets/icons`);
                setWalletIcons(response.data.data.map(icon => {
                    const label = icon.substring(icon.lastIndexOf('/') + 1).replace('.png', '');
                    return {
                        value: icon,
                        url: `${import.meta.env.VITE_ICONS_BASE_URL}${icon}`,
                        label: label.charAt(0).toUpperCase() + label.slice(1),
                    }
                }));
            } catch (err) {
                console.error("Error fetching wallet icons: ", err);
            }
        };
        fetchWalletIcons();
    }, [api])

    return {
        walletIcons,
    };
};

export const useCategoryIcons = () => {
    const [categoryIcons, setCategoryIcons] = useState([]);

    const api = useApiClient();

    useEffect(() => {
        const fetchWalletIcons = async () => {
            try {
                const response = await api.get(`/categories/icons`);
                setCategoryIcons(response.data.data.map(icon => {
                    const label = icon.substring(icon.lastIndexOf('/') + 1).replace('.png', '');
                    return {
                        value: icon,
                        url: `${import.meta.env.VITE_ICONS_BASE_URL}${icon}`,
                        label: label.charAt(0).toUpperCase() + label.slice(1),
                    }
                }));
            } catch (err) {
                console.error("Error fetching category icons: ", err);
            }
        };
        fetchWalletIcons();
    }, [api])

    return {
        categoryIcons,
    };
};