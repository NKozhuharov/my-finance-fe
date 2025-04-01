import {Link, useNavigate} from "react-router";
import {useActionState, useContext, useEffect, useState} from "react";
import {addBodyClass, removeBodyClass} from "@utils/helpers.js";
import {useLogin} from "@api/authApi.js";
import {UserContext} from "@contexts/UserContext.jsx";

export default function Login() {
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });
    const [loginErrors, setLoginErrors] = useState({});
    const navigate = useNavigate();
    const {userLoginHandler} = useContext(UserContext);
    const {login} = useLogin();

    useEffect(() => {
        addBodyClass('login-page');
        addBodyClass('bg-body-secondary');

        return () => {
            removeBodyClass('login-page');
            removeBodyClass('bg-body-secondary');
        };
    }, []);

    const loginHandler = async (_, formData) => {
        setLoginErrors({});
        const values = Object.fromEntries(formData);
        setFormValues(values);

        const authData = await login(values.email, values.password);

        if (authData.status === 'error') {
            if (authData.details) {
                setLoginErrors(authData.details);
            } else {
                alert(authData.message);
            }

            return;
        }

        authData.isLoggedIn = true;

        userLoginHandler(authData);

        navigate('/dashboard');
    };

    const [_, loginAction, isPending] = useActionState(loginHandler, {email: '', password: ''});

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
                            <input
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                                className={`form-control${loginErrors.email ? ' is-invalid' : ''}`}
                                placeholder="Email"
                                required
                            />
                            <div className="input-group-text"><span className="bi bi-envelope"></span></div>
                            {loginErrors.email &&
                                <span className="text-danger" role="alert">
                                    <strong>{loginErrors.email}</strong>
                                </span>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="password"
                                name="password"
                                value={formValues.password}
                                onChange={(e) => setFormValues({...formValues, password: e.target.value})}
                                className={`form-control${loginErrors.password ? ' is-invalid' : ''}`}
                                placeholder="Password"
                                required
                            />
                            <div className="input-group-text"><span className="bi bi-lock-fill"></span></div>
                            {loginErrors.password &&
                                <span className="text-danger" role="alert">
                                    <strong>{loginErrors.password}</strong>
                                </span>
                            }
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
                                    <button type="submit" className="btn btn-primary" disabled={isPending}>Sign In</button>
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
