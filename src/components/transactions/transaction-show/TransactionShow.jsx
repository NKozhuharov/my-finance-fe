import React, {useContext, useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate, useParams} from "react-router";
import Modal from "react-bootstrap/Modal";
import {Button, Card, CardBody, CardHeader, Col, FormControl, FormLabel, FormText, InputGroup, Row} from "react-bootstrap";
import {useAlert} from "@contexts/AlertContext.jsx";
import CategoryNameAndIcon from "@components/categories/category-name-and-icon/CategoryNameAndIcon.jsx";
import InputGroupText from "react-bootstrap/InputGroupText";
import {UserContext} from "@contexts/UserContext.jsx";

export default function TransactionShow() {
    const {transactionId} = useParams();

    const [transaction, setTransaction] = useState({});
    const [loading, setLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {user} = useContext(UserContext);

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await api.get(`/transactions/${transactionId}?resolve[]=category`);

                let transactionData = response.data.data;
                transactionData.amount = Math.abs(transactionData.amount);
                const dateParts = transactionData.date.split(".");
                transactionData.date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

                setTransaction(transactionData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching transaction data: ", err);
                setLoading(false);
            }
        };

        fetchTransaction();
        document.title = "View Transaction";
    }, [api, transactionId]);

    const handleCloseModal = () => setShowDeleteModal(false);
    const handleShowModal = () => setShowDeleteModal(true);

    const handleTransactionDelete = (event) => {
        event.preventDefault();

        api.delete(`/categories/${transactionId}`, {})
            .then(() => {
                setAlert({variant: "success", text: "Transaction deleted successfully."});
                setShowDeleteModal(false);
                navigate(`/transactions`);
            })
            .catch((error) => {
                setAlert({variant: "danger", text: error.response.data.message});
            }).finally(() => {
            setShowDeleteModal(false);
        })
    }

    return (
        <>
            <Modal show={showDeleteModal} onHide={handleCloseModal}>
                <form onSubmit={handleTransactionDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="alert alert-danger">
                            Are you sure you want to delete this transaction? This action cannot be undone.
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button type="submit" variant="danger">
                            Confirm
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Row>
                <Col>
                    <Card className="card-primary">
                        <CardHeader>
                            <div className="card-tools-left">
                                <Link className="btn btn-tool" to="/transactions" title="Back">
                                    <i className="bi bi-arrow-left"></i>
                                </Link>
                            </div>
                            <div className="card-tools">
                                <Link className="btn btn-tool" to={`/transactions/${transaction.id}/edit`} title="Edit"><i className="bi bi-pencil-fill"></i></Link>
                                <Button className="btn-tool" title="Delete" onClick={handleShowModal} disabled={loading}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {loading ? (
                                <FormText>Loading...</FormText>
                            ) : (
                                <>
                                    <Row className="mb-2">
                                        <Col>
                                            <div className="d-flex align-items-center">
                                                <CategoryNameAndIcon {...transaction.category.data} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="mb-2">
                                            <FormLabel htmlFor="date" className="form-label fw-bold" column={true}>Amount</FormLabel>
                                            <InputGroup>
                                                <div className="input-group-prepend">
                                                    <InputGroupText>{user.active_wallet.currency.symbol}</InputGroupText>
                                                </div>
                                                <FormControl name="amount" value={transaction.amount} disabled/>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="mb-2">
                                            <FormLabel htmlFor="date" className="form-label fw-bold" column={true}>Date</FormLabel>
                                            <FormControl type="date" name="date" value={transaction.date} disabled/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormLabel htmlFor="note" className="form-label fw-bold" column={true}>Note</FormLabel>
                                            <textarea className="form-control" name="note" value={transaction.note ?? ''} disabled></textarea>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}