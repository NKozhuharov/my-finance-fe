import {useState} from "react";
import {Link} from "react-router";

export default function UserMenu({firstName, lastName}) {
    const [isShown, setIsShown] = useState(false);

    const showHandler = () => {
        setIsShown(!isShown)
    }

    return <li className="nav-item dropdown user-menu">
        <a href="#" onClick={showHandler} className={`nav-link dropdown-toggle${isShown ? ' show' : ''}`}>
            <b className="d-none d-md-inline">{`${firstName[0]} ${lastName[0]}`}</b>

        </a>
        <ul className={`dropdown-menu dropdown-menu-lg dropdown-menu-end${isShown ? ' show' : ''}`} data-bs-popper="static">
            <li className="user-header text-bg-primary" style={{minHeight: "0"}}>
                {`${firstName} ${lastName}`}
            </li>
            <li className="user-footer">
                <Link to="/user-profile" className="btn btn-default">Profile</Link>
                <Link to="/logout" className="btn btn-default float-end">Sign out</Link>
            </li>
        </ul>
    </li>
}
