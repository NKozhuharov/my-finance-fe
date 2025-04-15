import React, {useActionState, useContext, useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate, useParams} from "react-router";
import {useAlert} from "@contexts/AlertContext.jsx";
import CategorySelector from "@components/categories/category-selector/CategorySelector.jsx";
import {Button, Card, CardBody, CardHeader, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";
import {UserContext} from "@contexts/UserContext.jsx";

//possible date picker - https://www.npmjs.com/package/react-date-range
export default function TransactionEdit() {
    const {transactionId} = useParams();

    const [transaction, setTransaction] = useState({});
    const [loading, setLoading] = useState(true);

    const [formErrors, setFormErrors] = useState({});

    const {user} = useContext(UserContext);

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    useEffect(() => {
        // Fetch data from the API
        const fetchTransaction = async () => {
            try {
                const response = await api.get(`/transactions/${transactionId}?resolve[]=category`);

                let transactionData = response.data.data;
                transactionData.amount = Math.abs(transactionData.amount);
                const dateParts = transactionData.date.split(".");
                transactionData.date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                transactionData.category = transactionData.category.data;
                transactionData.note = transactionData.note ?? '';

                setTransaction(transactionData);
            } catch (err) {
                console.error("Error fetching transaction data: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
        document.title = "Edit Transaction";
    }, [api, transactionId]);

    const handleCategorySelect = (selectedCategory) => {
        transaction.category = selectedCategory;
    };

    const submitHandler = async (_, formData) => {
        setFormErrors({});
        const values = Object.fromEntries(formData);
        values.category_id = transaction.category.id;

        try {
            await api.patch(`/transactions/${transactionId}`, values, {});
            setAlert({variant: "success", text: "Transaction updated successfully."});
            navigate(`/transactions/${transactionId}`);
        } catch (err) {
            setFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, submitAction, isPending] = useActionState(submitHandler, {...transaction});

    return (
        <>
            <Row>
                <Col>
                    <form action={submitAction}>
                        <Card className="card-primary">
                            <CardHeader>
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to={`/transactions/${transactionId}`} title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Edit Transaction
                                <div className="card-tools">
                                    <Button className="btn btn-tool fw-bold" type="submit" title="Save" disabled={isPending || loading}>SAVE</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <>
                                        <Row>
                                            <Col>
                                                <InputGroup>
                                                    <div className="input-group-prepend">
                                                        <InputGroupText>{user.active_wallet.currency.symbol}</InputGroupText>
                                                    </div>
                                                    <Form.Control
                                                        type="number"
                                                        name="amount"
                                                        value={transaction.amount}
                                                        onChange={(e) => setTransaction({...transaction, amount: e.target.value})}
                                                        className={formErrors.amount ? 'is-invalid' : ''}
                                                        min="0"
                                                        step="0.1"
                                                        required
                                                    />
                                                    {formErrors.amount &&
                                                        <Form.Control.Feedback type="invalid">
                                                            <strong>{formErrors.amount}</strong>
                                                        </Form.Control.Feedback>
                                                    }
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <hr/>
                                        <Row className="mb-2">
                                            <Col>
                                                <CategorySelector onlyParents={true} withChildren={true} onCategorySelect={handleCategorySelect} preSelectedCategory={transaction.category}/>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col>
                                                <Form.Label htmlFor="date" className="form-label fw-bold" column={true}>Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="date"
                                                    value={transaction.date}
                                                    onChange={(e) => setTransaction({...transaction, date: e.target.value})}
                                                    className={formErrors.date ? 'is-invalid' : ''}
                                                    required
                                                />
                                                {formErrors.date &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.date}</strong>
                                                    </Form.Control.Feedback>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Label htmlFor="note" className="form-label fw-bold" column={true}>Note</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows="3"
                                                    name="note"
                                                    value={transaction.note ?? ''}
                                                    onChange={(e) => setTransaction({...transaction, note: e.target.value})}
                                                />
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