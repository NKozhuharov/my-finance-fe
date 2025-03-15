import {Route, Routes} from 'react-router'
import Home from "./components/home/Home.jsx";
import Register from "./components/register/Register.jsx";
import Login from "./components/login/Login.jsx";
import {useState} from "react";
import Terms from "./components/terms/terms.jsx";
import Dashboard from "./components/dashboard/dashboard.jsx";

function App() {
    const [email, setEmail] = useState('');

    const userLoginHandler = (email) => {
        setEmail(email);
    };

    return (
        <>
            <Routes>
                <Route index element={<Home/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/login" element={<Login onLogin={userLoginHandler}/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/terms" element={<Terms/>}/>
            </Routes>
        </>
    )
}

export default App
