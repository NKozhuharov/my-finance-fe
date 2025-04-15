import {Link} from "react-router";
import {useActionState, useContext, useEffect, useState} from "react";
import {addBodyClass, removeBodyClass} from "@utils/helpers.js";
import {useLogin} from "@api/authApi.js";
import {UserContext} from "@contexts/UserContext.jsx";
import {Button, Card, CardBody, Col, Form, InputGroup, Row} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";

export default function Login() {
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});
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
        setFormErrors({});
        const values = Object.fromEntries(formData);
        setFormValues(values);

        const authData = await login(values.email, values.password);

        if (authData.status === 'error') {
            if (authData.details) {
                setFormErrors(authData.details);
            } else {
                alert(authData.message);
            }

            return;
        }

        authData.isLoggedIn = true;

        userLoginHandler(authData);
    };

    const [_, loginAction, isPending] = useActionState(loginHandler, {email: '', password: ''});

    return (
        <div className="login-box">
            <div className="login-logo">
                <b>MyFinance</b>
            </div>

            <Card>
                <CardBody>
                    <p className="login-box-msg">Sign in to start your session</p>
                    <form action={loginAction}>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formValues.email}
                                        onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                                        className={formErrors.email ? 'is-invalid' : ''}
                                        placeholder="Email"
                                        required
                                    />
                                    <InputGroupText><i className="bi bi-envelope"></i></InputGroupText>
                                    {formErrors.email &&
                                        <Form.Control.Feedback type="invalid">
                                            <strong>{formErrors.email}</strong>
                                        </Form.Control.Feedback>
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formValues.password}
                                        onChange={(e) => setFormValues({...formValues, password: e.target.value})}
                                        className={formErrors.password ? 'is-invalid' : ''}
                                        placeholder="Password"
                                        required
                                    />
                                    <InputGroupText><i className="bi bi-lock-fill"></i></InputGroupText>
                                    {formErrors.password &&
                                        <Form.Control.Feedback type="invalid">
                                            <strong>{formErrors.password}</strong>
                                        </Form.Control.Feedback>
                                    }
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={8}>
                                <Form.Check>
                                    <Form.Check.Input name="rembember" value="" id="flexCheckDefault"/>
                                    <Form.Check.Label htmlFor="rembember">Remember Me</Form.Check.Label>
                                </Form.Check>
                            </Col>
                            <Col sm={4}>
                                <div className="d-grid gap-2">
                                    <Button type="submit" className="btn-primary" disabled={isPending}>Sign In</Button>
                                </div>
                            </Col>
                        </Row>
                    </form>
                    <Link to="/register">Register a new membership</Link>
                </CardBody>
            </Card>
        </div>
    );
}
