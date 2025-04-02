import React, {useActionState, useContext, useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useParams} from "react-router";
import {useAlert} from "@contexts/AlertContext.jsx";
import {UserContext} from "@contexts/UserContext.jsx";
import {Button, Card, CardBody, CardHeader, Col, FormControl, FormLabel, FormText, Row} from "react-bootstrap";

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
                setUserData(response.data.data || []);
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
                                Edit User {userData.first_name} {userData.last_name}
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
                                                <FormControl
                                                    name="first_name"
                                                    value={userData.first_name}
                                                    onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                                                    className={formErrors.first_name ? ' is-invalid' : ''}
                                                    placeholder="First Name"
                                                    required
                                                />
                                                {formErrors.first_name &&
                                                    <span className="text-danger" role="alert">
                                                <strong>{formErrors.first_name}</strong>
                                            </span>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="last_name" className="fw-bold" column={true}>Last Name</FormLabel>
                                                <FormControl
                                                    name="last_name"
                                                    value={userData.last_name}
                                                    onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                                                    className={formErrors.last_name ? ' is-invalid' : ''}
                                                    placeholder="Last Name"
                                                />
                                                {formErrors.last_name &&
                                                    <span className="text-danger" role="alert">
                                                <strong>{formErrors.last_name}</strong>
                                            </span>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="email" className="fw-bold" column={true}>Email</FormLabel>
                                                <FormControl
                                                    name="email"
                                                    value={userData.email}
                                                    className={`form-control`}
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="email" className="fw-bold" column={true}>Change Password</FormLabel>
                                                <FormControl
                                                    type="password"
                                                    name="password"
                                                    value={userData.password}
                                                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                                                    className={formErrors.password ? ' is-invalid' : ''}
                                                    placeholder="Password"
                                                />
                                                {formErrors.password &&
                                                    <span className="text-danger" role="alert">
                                            <strong>{formErrors.password}</strong>
                                        </span>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormLabel htmlFor="email" className="fw-bold" column={true}>Password Confirmation</FormLabel>
                                                <FormControl
                                                    type="password"
                                                    name="password_confirmation"
                                                    value={userData.password_confirmation}
                                                    onChange={(e) => setUserData({...userData, password_confirmation: e.target.value})}
                                                    className={formErrors.password_confirmation ? ' is-invalid' : ''}
                                                    placeholder="Password Confirmation"
                                                />
                                                {formErrors.password_confirmation &&
                                                    <span className="text-danger" role="alert">
                                            <strong>{formErrors.password_confirmation}</strong>
                                        </span>
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