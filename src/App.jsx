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
import WalletsList from "./components/wallets/wallets-list/WalletsList.jsx";
import WalletEdit from "./components/wallets/wallet-edit/WalletEdit.jsx";
import WalletCreate from "./components/wallets/wallet-create/WalletCreate.jsx";
import {AlertProvider} from "./providers/AlertProvider.jsx";

function App() {
    return (
        <>
            <UserProvider>
                <AlertProvider>
                    <Routes>
                        <Route index element={<Home/>}/>
                        <Route element={<AuthGuard/>}>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/wallets" element={<WalletsList/>}/>
                            <Route path="/wallets/:walletId/edit" element={<WalletEdit/>}/>
                            <Route path="/wallets/create" element={<WalletCreate/>}/>
                            <Route path="/logout" element={<Logout/>}/>
                        </Route>
                        <Route element={<GuestGuard/>}>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/terms" element={<Terms/>}/>
                        </Route>
                    </Routes>
                </AlertProvider>
            </UserProvider>
        </>
    )
}

export default App
