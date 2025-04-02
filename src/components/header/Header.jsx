import UserMenu from "@components/user-menu/UserMenu.jsx";
import WalletSwitcher from "@components/wallet-switcher/WalletSwitcher.jsx";
import {UserContext} from "@contexts/UserContext.jsx";
import {useContext} from "react";
import {Link} from "react-router";

export default function Header() {
    const authData = useContext(UserContext);

    return <nav className="app-header navbar navbar-expand bg-body sticky-top">
        <div className="container-fluid">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/dashboard" className="nav-link" data-lte-toggle="sidebar" title="Home">
                        <i className="bi bi-house"></i>
                    </Link>
                </li>
            </ul>
            <ul className="navbar-nav ms-auto">
                <WalletSwitcher/>
                <UserMenu firstName={authData.user.data.first_name} lastName={authData.user.data.last_name}/>
            </ul>
        </div>
    </nav>
}
