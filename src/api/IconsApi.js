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
                    return {
                        value: icon,
                        url: `${import.meta.env.VITE_ICONS_BASE_URL}${icon}`,
                        label: icon.replace('/images/icons/wallet/', '').replace('.png', '').charAt(0).toUpperCase() + icon.replace('/images/icons/wallet/', '').replace('.png', '').slice(1),
                    }
                }));
            } catch (err) {
                console.error("Error fetching currencies data: ", err);
            }
        };
        fetchWalletIcons();
    }, [api])

    return {
        walletIcons,
    };
};