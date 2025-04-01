import {Link} from "react-router";

export default function Sidebar() {
    return <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
        <div className="sidebar-brand">
            <Link to="/dashboard" className="brand-link">
                <img
                    src="/img/myf-logo.png"
                    alt="MyF Logo"
                    className="brand-image opacity-75 shadow img-circle"
                />
                <span className="brand-text fw-light">MyFinance</span>
            </Link>
        </div>
        <div className="sidebar-wrapper">
            <nav className="mt-2">
                <ul
                    className="nav sidebar-menu flex-column"
                    data-lte-toggle="treeview"
                    role="menu"
                    data-accordion="false"
                >
                    <li className="nav-item">
                        <Link to="/wallets" className="nav-link">
                            <i className="nav-icon bi bi-wallet"></i>
                            <p>Wallets</p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/categories" className="nav-link">
                            <i className="nav-icon bi bi-list"></i>
                            <p>Categories</p>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/transactions" className="nav-link">
                            <i className="nav-icon bi bi-currency-dollar"></i>
                            <p>Transactions</p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    </aside>
}