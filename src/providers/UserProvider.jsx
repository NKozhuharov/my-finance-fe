import { UserContext } from "../contexts/UserContext";
import usePersistedState from "../hooks/usePersistedState";

export default function UserProvider({
    children,
}) {
    const [authData, setAuthData] = usePersistedState('auth', {});

    const userLoginHandler = (resultData) => {
        setAuthData(resultData);
    };

    const userLogoutHandler = () => {
        setAuthData({});
    };

    const activeWalletChangeHandler = (walletId) => {
        setAuthData((prevAuthData) => ({
            ...prevAuthData,
            user: {
                ...prevAuthData.user,
                data: {
                    ...prevAuthData.user.data,
                    active_wallet_id: walletId,
                },
            },
        }));
    };

    return (
        <UserContext.Provider value={{ ...authData, userLoginHandler, userLogoutHandler, activeWalletChangeHandler }}>
            {children}
        </UserContext.Provider>
    );
}
