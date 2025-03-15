import UserMenu from "../user-menu/UserMenu.jsx";
import WalletSwitcher from "../wallet-switcher/WalletSwitcher.jsx";

export default function Header({toggleSidebar}) {
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
                <UserMenu userName="User Name"/>
            </ul>
        </div>
    </nav>
}
