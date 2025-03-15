import {Link, useNavigate} from "react-router";
import {useEffect} from "react";
import {addBodyClass, removeBodyClass} from "../../utils/helpers.js";

export default function Register(onRegister) {
    const navigate = useNavigate();

    useEffect(() => {
        addBodyClass('register-page');
        addBodyClass('bg-body-secondary');

        return () => {
            removeBodyClass('register-page');
            removeBodyClass('bg-body-secondary');
        };
    }, []);

    const registerAction = (formData) => {
        const email = formData.get('email');
        const password = formData.get('password');

        onRegister(email, password);

        navigate('/home');
    }

    return (
        <div className="register-box">
            <div className="register-logo">
                <b>MyFinance</b>
            </div>
            <div className="card">
                <div className="card-body register-card-body">
                    <p className="register-box-msg">Register a new membership</p>
                    <form action={registerAction}>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Full Name"/>
                            <div className="input-group-text"><span className="bi bi-person"></span></div>
                        </div>
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
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        I agree to the <Link to={"/terms"}>terms</Link>
                                    </label>
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
                       <Link to="/login">I already have a membership</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}