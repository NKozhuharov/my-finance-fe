import {Link, useNavigate} from "react-router";
import {useActionState, useContext, useEffect, useState} from "react";
import {addBodyClass, removeBodyClass} from "@utils/helpers.js";
import {UserContext} from "@contexts/UserContext.jsx";
import {useRegister} from "@api/authApi.js";
import {Card, CardBody, Col, FormCheck, FormControl, InputGroup, Row} from "react-bootstrap";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import InputGroupText from "react-bootstrap/InputGroupText";

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
            <Card>
                <CardBody>
                    <p className="register-box-msg">Register a new membership</p>
                    <form action={registerAction}>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        name="first_name"
                                        value={formValues.first_name}
                                        onChange={(e) => setFormValues({...formValues, first_name: e.target.value})}
                                        className={registerErrors.first_name ? ' is-invalid' : ''}
                                        placeholder="First Name"
                                        required
                                    />
                                    <InputGroupText><i className="bi bi-person"></i></InputGroupText>
                                    {registerErrors.first_name &&
                                        <span className="text-danger" role="alert">
                                            <strong>{registerErrors.first_name}</strong>
                                        </span>
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        name="last_name"
                                        value={formValues.last_name}
                                        onChange={(e) => setFormValues({...formValues, last_name: e.target.value})}
                                        className={registerErrors.last_name ? ' is-invalid' : ''}
                                        placeholder="Last Name"
                                    />
                                    <InputGroupText><i className="bi bi-person"></i></InputGroupText>
                                    {registerErrors.last_name &&
                                        <span className="text-danger" role="alert">
                                            <strong>{registerErrors.last_name}</strong>
                                        </span>
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        type="email"
                                        name="email"
                                        value={formValues.email}
                                        onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                                        className={registerErrors.email ? ' is-invalid' : ''}
                                        placeholder="Email"
                                        required
                                    />
                                    <InputGroupText><i className="bi bi-envelope"></i></InputGroupText>
                                    {registerErrors.email &&
                                        <span className="text-danger" role="alert">
                                            <strong>{registerErrors.email}</strong>
                                        </span>
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        type="password"
                                        name="password"
                                        value={formValues.password}
                                        onChange={(e) => setFormValues({...formValues, password: e.target.value})}
                                        className={registerErrors.password ? ' is-invalid' : ''}
                                        placeholder="Password"
                                        required
                                    />
                                    <InputGroupText><i className="bi bi-lock-fill"></i></InputGroupText>
                                    {registerErrors.password &&
                                        <span className="text-danger" role="alert">
                                            <strong>{registerErrors.password}</strong>
                                        </span>
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        type="password"
                                        name="password_confirmation"
                                        value={formValues.password_confirmation}
                                        onChange={(e) => setFormValues({...formValues, password_confirmation: e.target.value})}
                                        className={registerErrors.password_confirmation ? ' is-invalid' : ''}
                                        placeholder="Password Confirmation"
                                        required
                                    />
                                    <InputGroupText><i className="bi bi-lock-fill"></i></InputGroupText>
                                    {registerErrors.password_confirmation &&
                                        <span className="text-danger" role="alert">
                                            <strong>{registerErrors.password_confirmation}</strong>
                                        </span>
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={8}>
                                <FormCheck>
                                    <FormCheckInput name="terms" value="" id="flexCheckDefault" required/>
                                    <FormCheckLabel htmlFor="terms">
                                        I agree to the <Link to={"/terms"}>terms</Link>
                                    </FormCheckLabel>
                                </FormCheck>
                            </Col>
                            <Col sm={4}>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isPending}>Register</button>
                                </div>
                            </Col>
                        </Row>
                    </form>

                    <p className="mb-0">
                        <Link to="/login">I already have a membership</Link>
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}