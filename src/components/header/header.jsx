import UserMenu from "../user-menu/UserMenu.jsx";
import WalletSwitcher from "../wallet-switcher/WalletSwitcher.jsx";
import {UserContext} from "../../contexts/UserContext.jsx";
import {useContext} from "react";

export default function Header({toggleSidebar}) {
    const authData = useContext(UserContext);

    return <nav className="app-header navbar navbar-expand bg-body">
        <div className="container-fluid">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a onClick={toggleSidebar} className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                        <i className="bi bi-list"></i>
                    </a>
                </li>
            </ul>
            <ul className="navbar-nav ms-auto">
                <WalletSwitcher/>
                <UserMenu firstName={authData.user.data.first_name} lastName={authData.user.data.last_name}/>
            </ul>
        </div>
    </nav>
}
