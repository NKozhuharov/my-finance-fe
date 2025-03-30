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
import CategoriesList from "./components/categories/categories-list/CategoriesList.jsx";
import UserProfile from "./components/user-profile/UserProfile.jsx";
import CategoryShow from "./components/categories/category-show/CategoryShow.jsx";
import CategoryEdit from "./components/categories/category-edit/CategoryEdit.jsx";
import CategoryCreate from "./components/categories/category-create/CategoryCreate.jsx";

function App() {
    return (
        <>
            <UserProvider>
                <AlertProvider>
                    <Routes>
                        <Route index element={<Home/>}/>
                        <Route element={<AuthGuard/>}>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/user-profile" element={<UserProfile/>}/>
                            <Route path="/wallets" element={<WalletsList/>}/>
                            <Route path="/wallets/:walletId/edit" element={<WalletEdit/>}/>
                            <Route path="/wallets/create" element={<WalletCreate/>}/>
                            <Route path="/categories" element={<CategoriesList/>}/>
                            <Route path="/categories/:categoryId" element={<CategoryShow/>}/>
                            <Route path="/categories/:categoryId/edit" element={<CategoryEdit/>}/>
                            <Route path="/categories/create" element={<CategoryCreate/>}/>
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
