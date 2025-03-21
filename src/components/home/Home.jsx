import {useContext} from "react";
import {UserContext} from "../../contexts/UserContext.jsx";
import {Navigate} from "react-router";

export default function Home() {
    const authData = useContext(UserContext);

    if (authData?.isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }

    return <Navigate to="/login" />;
}
