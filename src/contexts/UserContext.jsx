import {createContext, useContext} from "react";

export const UserContext = createContext({
    token: '',
    user: {
        data: {
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            active_wallet_id: null,
        }
    },
    isLoggedIn: false,
    userLoginHandler: () => null,
    userLogoutHandler: () => null,
    activeWalletChangeHandler: () => null,
});

export function useUserContext() {
    return useContext(UserContext);
}
