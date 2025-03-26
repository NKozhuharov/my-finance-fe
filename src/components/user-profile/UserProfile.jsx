import React, {useActionState, useContext, useEffect, useState} from "react";
import AdminPanelPage from "../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../hooks/useApiClient.js";
import {Link, useParams} from "react-router";
import {useAlert} from "../../contexts/AlertContext.jsx";
import {UserContext} from "../../contexts/UserContext.jsx";

export default function UserProfile() {
    const {walletId} = useParams();

    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

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

    const [_, editAction, isPending] = useActionState(userEditHandler, {...userData});

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <form action={editAction} autoComplete="off">
                        <div className="card card-primary">
                            <div className="card-header">
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to="/dashboard" title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Edit User {userData.first_name} {userData.last_name}
                                <div className="card-tools">
                                    <button className="btn btn-tool fw-bold" type="submit" title="Save" disabled={isPending}>SAVE</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="first_name" className="form-label fw-bold">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={userData.first_name}
                                            onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                                            className={`form-control${formErrors.first_name ? ' is-invalid' : ''}`}
                                            placeholder="First Name"
                                            required
                                        />
                                        {formErrors.first_name &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{formErrors.first_name}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="last_name" className="form-label fw-bold">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={userData.last_name}
                                            onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                                            className={`form-control${formErrors.last_name ? ' is-invalid' : ''}`}
                                            placeholder="Last Name"
                                        />
                                        {formErrors.last_name &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{formErrors.last_name}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label fw-bold">Email</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={userData.email}
                                            className={`form-control`}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label fw-bold">Change Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={userData.password}
                                            onChange={(e) => setUserData({...userData, password: e.target.value})}
                                            className={`form-control${formErrors.password ? ' is-invalid' : ''}`}
                                            placeholder="Password"
                                        />
                                        {formErrors.password &&
                                            <span className="invalid-feedback" role="alert">
                                            <strong>{formErrors.password}</strong>
                                        </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label fw-bold">Password Confirmation</label>
                                        <input
                                            type="password"
                                            name="password_confirmation"
                                            value={userData.password_confirmation}
                                            onChange={(e) => setUserData({...userData, password_confirmation: e.target.value})}
                                            className={`form-control${formErrors.password_confirmation ? ' is-invalid' : ''}`}
                                            placeholder="Password Confirmation"
                                        />
                                        {formErrors.password_confirmation &&
                                            <span className="invalid-feedback" role="alert">
                                            <strong>{formErrors.password_confirmation}</strong>
                                        </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPanelPage>
    )
        ;
}