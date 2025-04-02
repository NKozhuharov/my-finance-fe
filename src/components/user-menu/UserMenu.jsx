import {useState} from "react";
import {Link} from "react-router";
import {Button} from "react-bootstrap";
import {useLogout} from "@api/authApi.js";

export default function UserMenu({firstName, lastName}) {
    const [isShown, setIsShown] = useState(false);

    const {logout} = useLogout();

    const showHandler = () => {
        setIsShown(!isShown)
    }

    const handleLogout = () => {
        logout();
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
                <Link to="/user-profile" className="btn btn-primary">Profile</Link>
                <Button to="/logout" className="btn-danger float-end" onClick={handleLogout}>Sign out</Button>
            </li>
        </ul>
    </li>
}
