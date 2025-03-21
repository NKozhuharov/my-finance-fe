import {Navigate, Outlet} from "react-router";
import {useContext} from "react";
import {UserContext} from "../contexts/UserContext.jsx";

export default function GuestGuard() {
    const authData = useContext(UserContext);

    if (authData.isLoggedIn) {
        return <Navigate to="/dashboard"/>
    }

    return <Outlet/>;
}
