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
import TransactionCreate from "./components/transactions/transaction-create/TransactionCreate.jsx";
import TransactionsList from "./components/transactions/transactions-list/TransactionsList.jsx";
import TransactionShow from "./components/transactions/transaction-show/TransactionShow.jsx";
import TransactionEdit from "./components/transactions/transaction-edit/TransactionEdit.jsx";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage.jsx";
import Report from "@components/reports/Report.jsx";

function App() {
    return (
        <>
            <UserProvider>
                <AlertProvider>
                    <Routes>
                        <Route index element={<Home/>}/>
                        <Route element={<AuthGuard/>}>
                            <Route element={<AdminPanelPage/>}>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/user-profile" element={<UserProfile/>}/>
                                <Route path="/wallets" element={<WalletsList/>}/>
                                <Route path="/wallets/:walletId/edit" element={<WalletEdit/>}/>
                                <Route path="/wallets/create" element={<WalletCreate/>}/>
                                <Route path="/categories" element={<CategoriesList/>}/>
                                <Route path="/categories/:categoryId" element={<CategoryShow/>}/>
                                <Route path="/categories/:categoryId/edit" element={<CategoryEdit/>}/>
                                <Route path="/categories/create" element={<CategoryCreate/>}/>
                                <Route path="/transactions" element={<TransactionsList/>}/>
                                <Route path="/transactions/:transactionId" element={<TransactionShow/>}/>
                                <Route path="/transactions/:transactionId/edit" element={<TransactionEdit/>}/>
                                <Route path="/transactions/create" element={<TransactionCreate/>}/>
                                <Route path="/reports" element={<Report/>}/>
                            </Route>
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
