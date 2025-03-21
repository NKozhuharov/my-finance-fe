import {Link, useNavigate} from "react-router";
import {useActionState, useContext, useEffect, useState} from "react";
import {addBodyClass, removeBodyClass} from "../../utils/helpers.js";
import {UserContext} from "../../contexts/UserContext.jsx";
import {useRegister} from "../../api/authApi.js";

export default function Register() {
    const [formValues, setFormValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [registerErrors, setRegisterErrors] = useState({});
    const navigate = useNavigate();
    const {userLoginHandler} = useContext(UserContext);
    const {register} = useRegister();

    useEffect(() => {
        addBodyClass('register-page');
        addBodyClass('bg-body-secondary');

        return () => {
            removeBodyClass('register-page');
            removeBodyClass('bg-body-secondary');
        };
    }, []);

    const registerHandler = async (_, formData) => {
        setRegisterErrors({});
        const values = Object.fromEntries(formData);
        setFormValues(values);

        const authData = await register(
            values.first_name,
            values.last_name,
            values.email,
            values.password,
            values.password_confirmation,
        );

        if (authData.status === 'error') {
            if (authData.details) {
                setRegisterErrors(authData.details);
            } else {
                alert(authData.message);
            }

            return;
        }

        authData.isLoggedIn = true;

        userLoginHandler(authData);

        navigate('/dashboard');
    }

    const [_, registerAction, isPending] = useActionState(registerHandler, {email: '', password: ''});

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
                            <input
                                type="text"
                                name="first_name"
                                value={formValues.first_name}
                                onChange={(e) => setFormValues({...formValues, first_name: e.target.value})}
                                className={`form-control${registerErrors.first_name ? ' is-invalid' : ''}`}
                                placeholder="First Name"
                            />
                            <div className="input-group-text"><span className="bi bi-person"></span></div>
                            {registerErrors.first_name &&
                                <span className="invalid-feedback" role="alert">
                                <strong>{registerErrors.first_name}</strong>
                            </span>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                name="last_name"
                                value={formValues.last_name}
                                onChange={(e) => setFormValues({...formValues, last_name: e.target.value})}
                                className={`form-control${registerErrors.last_name ? ' is-invalid' : ''}`}
                                placeholder="Last Name"
                            />
                            <div className="input-group-text"><span className="bi bi-person"></span></div>
                            {registerErrors.last_name &&
                                <span className="invalid-feedback" role="alert">
                                <strong>{registerErrors.last_name}</strong>
                            </span>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                                className={`form-control${registerErrors.email ? ' is-invalid' : ''}`}
                                placeholder="Email"
                            />
                            <div className="input-group-text"><span className="bi bi-envelope"></span></div>
                            {registerErrors.email &&
                                <span className="invalid-feedback" role="alert">
                                <strong>{registerErrors.email}</strong>
                            </span>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="password"
                                name="password"
                                value={formValues.password}
                                onChange={(e) => setFormValues({...formValues, password: e.target.value})}
                                className={`form-control${registerErrors.password ? ' is-invalid' : ''}`}
                                placeholder="Password"
                            />
                            <div className="input-group-text"><span className="bi bi-lock-fill"></span></div>
                            {registerErrors.password &&
                                <span className="invalid-feedback" role="alert">
                                <strong>{registerErrors.password}</strong>
                            </span>
                            }
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formValues.password_confirmation}
                                onChange={(e) => setFormValues({...formValues, password_confirmation: e.target.value})}
                                className={`form-control${registerErrors.password_confirmation ? ' is-invalid' : ''}`}
                                placeholder="Password Confirmation"
                            />
                            <div className="input-group-text"><span className="bi bi-lock-fill"></span></div>
                            {registerErrors.password_confirmation &&
                                <span className="invalid-feedback" role="alert">
                                <strong>{registerErrors.password_confirmation}</strong>
                            </span>
                            }
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" required/>
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        I agree to the <Link to={"/terms"}>terms</Link>
                                    </label>
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
                        <Link to="/login">I already have a membership</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}