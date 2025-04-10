import {createContext, useContext} from "react";

export const UserContext = createContext({
    token: '',
    user: {
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        active_wallet_id: null,
        active_wallet: {
            name: '',
            icon: `${import.meta.env.VITE_ICONS_BASE_URL}/images/icons/wallet/default.png`,
            total_amount: 0,
            total_formatted: 0,
            currency: {
                name: 'EUR',
                code: 'EUR',
                symbol: '€',
                rate: 1
            }
        }
    },
    isLoggedIn: false,
    userLoginHandler: () => null,
    userLogoutHandler: () => null,
    userDataChangeHandler: () => null,
});

export function useUserContext() {
    return useContext(UserContext);
}
