import React, {useActionState, useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate} from "react-router";
import {useAlert} from "@contexts/AlertContext.jsx";
import CategorySelector from "@components/categories/category-selector/CategorySelector.jsx";
import {Button, Card, CardBody, CardHeader, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";

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

    const handleCategorySelect = (selectedCategory) => {
        transaction.category = selectedCategory;
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
            <Row>
                <Col>
                    <form action={submitAction}>
                        <Card className="card-primary">
                            <CardHeader>
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to={`/transactions`} title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Create Transaction
                                <div className="card-tools">
                                    <Button className="btn-tool fw-bold" type="submit" title="Save" disabled={isPending}>SAVE</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-2">
                                    <Col>
                                        <InputGroup>
                                            <div className="input-group-prepend">
                                                <InputGroupText>лв.</InputGroupText>
                                            </div>
                                            <FormControl
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
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row className="mb-2">
                                    <Col>
                                        <CategorySelector onlyParents={true} withChildren={true} onCategorySelect={handleCategorySelect}/>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <label htmlFor="date" className="form-label fw-bold">Date</label>
                                        <FormControl
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
                                    </Col>
                                </Row>
                                <Row className="row">
                                    <Col>
                                        <label htmlFor="note" className="form-label fw-bold">Note</label>
                                        <textarea
                                            className="form-control"
                                            name="note"
                                            value={transaction.note}
                                            onChange={(e) => setTransaction({...transaction, note: e.target.value})}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </form>
                </Col>
            </Row>
        </AdminPanelPage>
    );
}