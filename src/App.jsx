import {Route, Routes} from 'react-router'
import Home from "./components/home/Home.jsx";
import Register from "./components/register/Register.jsx";
import Login from "./components/login/Login.jsx";
import Terms from "./components/terms/terms.jsx";
import Dashboard from "./components/dashboard/dashboard.jsx";
import UserProvider from "./providers/UserProvider.jsx";
import Logout from "./components/logout/Logout.jsx";

function App() {


    return (
        <>
            <UserProvider>
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/terms" element={<Terms/>}/>
                </Routes>
            </UserProvider>
        </>
    )
}

export default App
