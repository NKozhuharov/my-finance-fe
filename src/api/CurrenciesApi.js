import {useEffect, useState} from "react";
import {useApiClient} from "../hooks/useApiClient.js";

export const useCurrencies = () => {
    const [currencies, setCurrencies] = useState([]);

    const api = useApiClient();

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await api.get(`/currencies`);
                setCurrencies(response.data.data.map(currency => {
                    return {
                        value: currency.id,
                        label: currency.name,
                    }
                }));
            } catch (err) {
                console.error("Error fetching currencies data: ", err);
            }
        };
        fetchCurrencies();
    }, [api])

    return {
        currencies,
    };
};