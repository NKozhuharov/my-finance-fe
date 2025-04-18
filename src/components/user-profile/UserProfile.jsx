import React, {useActionState, useContext, useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useParams} from "react-router";
import {useAlert} from "@contexts/AlertContext.jsx";
import {UserContext} from "@contexts/UserContext.jsx";
import {Button, Card, CardBody, CardHeader, Col, Form, FormLabel, FormText, Row} from "react-bootstrap";

export default function UserProfile() {
    const {walletId} = useParams();

    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(true);
    const [formErrors, setFormErrors] = useState({});

    const api = useApiClient();

    const {setAlert} = useAlert();

    const {userDataChangeHandler} = useContext(UserContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/user`);
                //necessary to add the password defaults
                setUserData((prevUserData) => ({...prevUserData, ...response.data.data}));
            } catch (err) {
                console.error("Error fetching user data: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [api, walletId]);

    const userEditHandler = async (_, formData) => {
        setFormErrors({});
        const values = Object.fromEntries(formData);

        try {
            await api.patch(`/user`, values, {});
            userDataChangeHandler({first_name: values.first_name, last_name: values.last_name});
            setAlert({variant: "success", text: "User edited successfully."});
        } catch (err) {
            setFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, submitAction, isPending] = useActionState(userEditHandler, {...userData});

    return (
        <>
            <Row>
                <Col>
                    <form action={submitAction} autoComplete="off">
                        <Card className="card-primary">
                            <CardHeader>
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to="/dashboard" title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Edit User
                                <div className="card-tools">
                                    <Button className="btn-tool fw-bold" type="submit" title="Save" disabled={isPending || loading}>SAVE</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <FormText>Loading user...</FormText>
                                ) : (
                                    <>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="first_name" className="fw-bold" column={true}>First Name</FormLabel>
                                                <Form.Control
                                                    name="first_name"
                                                    value={userData.first_name}
                                                    onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                                                    className={formErrors.first_name ? 'is-invalid' : ''}
                                                    placeholder="First Name"
                                                    required
                                                />
                                                {formErrors.first_name &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.first_name}</strong>
                                                    </Form.Control.Feedback>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="last_name" className="fw-bold" column={true}>Last Name</FormLabel>
                                                <Form.Control
                                                    name="last_name"
                                                    value={userData.last_name}
                                                    onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                                                    className={formErrors.last_name ? 'is-invalid' : ''}
                                                    placeholder="Last Name"
                                                />
                                                {formErrors.last_name &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.last_name}</strong>
                                                    </Form.Control.Feedback>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="email" className="fw-bold" column={true}>Email</FormLabel>
                                                <Form.Control
                                                    name="email"
                                                    value={userData.email }
                                                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="email" className="fw-bold" column={true}>Change Password</FormLabel>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    value={userData.password}
                                                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                                                    className={formErrors.password ? 'is-invalid' : ''}
                                                    placeholder="Password"
                                                />
                                                {formErrors.password &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.password}</strong>
                                                    </Form.Control.Feedback>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="email" className="fw-bold" column={true}>Password Confirmation</FormLabel>
                                                <Form.Control
                                                    type="password"
                                                    name="password_confirmation"
                                                    value={userData.password_confirmation}
                                                    onChange={(e) => setUserData({...userData, password_confirmation: e.target.value})}
                                                    className={formErrors.password_confirmation ? 'is-invalid' : ''}
                                                    placeholder="Password Confirmation"
                                                />
                                                {formErrors.password_confirmation &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.password_confirmation}</strong>
                                                    </Form.Control.Feedback>
                                                }
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </form>
                </Col>
            </Row>
        </>
    );
}