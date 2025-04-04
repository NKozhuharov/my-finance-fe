import { UserContext } from "../contexts/UserContext";
import usePersistedState from "../hooks/usePersistedState";

export default function UserProvider({
    children,
}) {
    const [authData, setAuthData] = usePersistedState('auth', null);

    const userLoginHandler = (resultData) => {
        setAuthData(resultData);
    };

    const userLogoutHandler = () => {
        console.log('User logged out');
        setAuthData(null);
    };

    const userDataChangeHandler = (userData) => {
        setAuthData((prevAuthData) => ({
            ...prevAuthData,
            user: {
                ...prevAuthData.user,
                data: {
                    ...prevAuthData.user.data,
                    ...userData
                },
            },
        }));
    }

    return (
        <UserContext.Provider value={{ ...authData, userLoginHandler, userLogoutHandler, userDataChangeHandler }}>
            {children}
        </UserContext.Provider>
    );
}
