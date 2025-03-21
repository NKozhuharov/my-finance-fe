import {useContext, useMemo} from "react";
import ApiClient from "../api/ApiClient";
import {UserContext} from "../contexts/UserContext";

export function useApiClient() {
    const {token} = useContext(UserContext);

    return useMemo(() => {
        // Initialize ApiClient with the base URL
        const client = new ApiClient();

        // Inject token from user data (if available)
        if (token) {
            client.setToken(token);
        }

        return client;
    }, [token]);
}
