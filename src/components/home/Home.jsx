import {Button} from "react-bootstrap";
import Login from "../login/Login.jsx";

export default function Home(email) {
    return (

    <div>
            {email === null ? (
                // Show login page if email is not set
                <Login />
            ) : (
                // Show main content if email is set
                <div>
                    <h1>Welcome Back!</h1>
                    <p>Your email is {email}</p>
                    <Button>Logout</Button>
                </div>
            )}
        </div>

    );
}
