import {Route, Routes} from 'react-router'
import Home from "./components/home/Home.jsx";
import Register from "./components/register/Register.jsx";
import Login from "./components/login/Login.jsx";
import Terms from "./components/terms/terms.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import UserProvider from "./providers/UserProvider.jsx";
import Logout from "./components/logout/Logout.jsx";
import AuthGuard from "./guards/AuthGuard.jsx";
import GuestGuard from "./guards/GuestGuard.jsx";

function App() {
    return (
        <>
            <UserProvider>
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route element={<AuthGuard/>}>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/logout" element={<Logout/>}/>
                    </Route>
                    <Route element={<GuestGuard/>}>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/terms" element={<Terms/>}/>
                    </Route>
                </Routes>
            </UserProvider>
        </>
    )
}

export default App
