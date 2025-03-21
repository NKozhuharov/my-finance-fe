import {Navigate, Outlet} from "react-router";
import {useContext} from "react";
import {UserContext} from "../contexts/UserContext.jsx";

export default function AuthGuard() {
    const authData = useContext(UserContext);

    if (!authData.isLoggedIn) {
        return <Navigate to="/login"/>
    }

    return <Outlet/>;
}
