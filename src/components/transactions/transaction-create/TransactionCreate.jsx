import React, {useActionState, useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate} from "react-router";
import {useAlert} from "@contexts/AlertContext.jsx";
import CategorySelector from "@components/categories/category-selector/CategorySelector.jsx";

//possible date picker - https://www.npmjs.com/package/react-date-range
export default function TransactionCreate() {
    const [transaction, setTransaction] = useState({
        amount: 0,
        category: {},
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    useEffect(() => {
        document.title = "Create Transaction";
    });

    const handleCategorySelect = (category) => {
        transaction.category = category;
    };

    const submitHandler = async (_, formData) => {
        setFormErrors({});
        const values = Object.fromEntries(formData);
        values.category_id = transaction.category.id;

        try {
            await api.post(`/transactions`, values, {});
            setAlert({variant: "success", text: "Transaction created successfully."});
            navigate(`/transactions`);
        } catch (err) {
            setFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, submitAction, isPending] = useActionState(submitHandler, {...transaction});

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <form action={submitAction}>
                        <div className="card card-primary">
                            <div className="card-header">
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to={`/transactions`} title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Create Transaction
                                <div className="card-tools">
                                    <button className="btn btn-tool fw-bold" type="submit" title="Save" disabled={isPending}>SAVE</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">лв.</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={transaction.amount}
                                                onChange={(e) => setTransaction({...transaction, amount: e.target.value})}
                                                className={`form-control${formErrors.amount ? ' is-invalid' : ''}`}
                                                min="0"
                                                step="0.1"
                                                required
                                            />
                                            {formErrors.amount &&
                                                <span className="text-danger" role="alert">
                                                <strong>{formErrors.amount}</strong>
                                            </span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <CategorySelector onlyParents={true} withChildren={true} onCategorySelect={handleCategorySelect}/>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="date" className="form-label fw-bold">Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={transaction.date}
                                            onChange={(e) => setTransaction({...transaction, date: e.target.value})}
                                            className={`form-control${formErrors.date ? ' is-invalid' : ''}`}
                                            required
                                        />
                                        {formErrors.date &&
                                            <span className="text-danger" role="alert">
                                                <strong>{formErrors.date}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <label htmlFor="note" className="form-label fw-bold">Note</label>
                                        <textarea
                                            className="form-control"
                                            name="note"
                                            value={transaction.note}
                                            onChange={(e) => setTransaction({...transaction, note: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPanelPage>
    );
}