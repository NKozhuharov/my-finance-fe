import { UserContext } from "../contexts/UserContext";
import usePersistedState from "../hooks/usePersistedState";

export default function UserProvider({
    children,
}) {
    const [authData, setAuthData] = usePersistedState('auth', null);

    const userLoginHandler = (resultData) => {
        resultData.user = resultData.user.data;
        resultData.user.active_wallet = resultData.user.active_wallet.data;
        resultData.user.active_wallet.currency = resultData.user.active_wallet.currency.data;
        setAuthData(resultData);
    };

    const userLogoutHandler = () => {
        setAuthData(null);
    };

    const userDataChangeHandler = (userData) => {
        setAuthData((prevAuthData) => ({
            ...prevAuthData,
            user: {
                ...prevAuthData.user,
                ...userData
            },
        }));
    }

    return (
        <UserContext.Provider value={{ ...authData, userLoginHandler, userLogoutHandler, userDataChangeHandler }}>
            {children}
        </UserContext.Provider>
    );
}
