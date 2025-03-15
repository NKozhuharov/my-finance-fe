import { Link, useNavigate } from "react-router";
import {useEffect} from "react";
import {addBodyClass, removeBodyClass} from "../../utils/helpers.js";

export default function Login(onLogin) {
    const navigate = useNavigate();

    useEffect(() => {
        addBodyClass('login-page');
        addBodyClass('bg-body-secondary');

        return () => {
            removeBodyClass('login-page');
            removeBodyClass('bg-body-secondary');
        };
    }, []);

    const loginAction = (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');

        onLogin(email, password);

        navigate('/home');
    }

    return (
        <div className="login-box">
            <div className="login-logo">
                <b>MyFinance</b>
            </div>

            <div className="card">
                <div className="card-body login-card-body">
                    <p className="login-box-msg">Sign in to start your session</p>
                    <form action={loginAction}>
                        <div className="input-group mb-3">
                            <input type="email" className="form-control" placeholder="Email"/>
                            <div className="input-group-text"><span className="bi bi-envelope"></span></div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Password"/>
                            <div className="input-group-text"><span className="bi bi-lock-fill"></span></div>
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                    <label className="form-check-label" htmlFor="flexCheckDefault"> Remember Me </label>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Sign In</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <p className="mb-0">
                        <Link to="/register">Register a new membership</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
