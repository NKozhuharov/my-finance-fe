import {Link} from "react-router";
import {Button, Dropdown} from "react-bootstrap";
import {useLogout} from "@api/authApi.js";

export default function UserMenu({firstName, lastName}) {
    const {logout} = useLogout();

    const handleLogout = () => {
        logout();
    }

    return <Dropdown className="nav-item dropdown user-menu">
        <Dropdown.Toggle className={`nav-link dropdown-toggle`} variant={"link"}>
            <b className="d-md-inline">{`${firstName[0]} ${lastName[0]}`}</b>
        </Dropdown.Toggle>
        <Dropdown.Menu className={`dropdown-menu dropdown-menu-lg dropdown-menu-end`} data-bs-popper="static">
            <li className="user-header text-bg-primary" style={{minHeight: "0"}}>
                {`${firstName} ${lastName}`}
            </li>
            <li className="user-footer">
                <Link to="/user-profile" className="btn btn-primary">Profile</Link>
                <Button to="/logout" className="btn-danger float-end" onClick={handleLogout}>Sign out</Button>
            </li>
        </Dropdown.Menu>
    </Dropdown>
}
