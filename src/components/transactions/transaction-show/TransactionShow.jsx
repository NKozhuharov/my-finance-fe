import React, {useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate, useParams} from "react-router";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import {useAlert} from "@contexts/AlertContext.jsx";
import CategoryNameAndIcon from "@components/categories/category-name-and-icon/CategoryNameAndIcon.jsx";

export default function TransactionShow() {
    const {transactionId} = useParams();

    const [transaction, setTransaction] = useState({});
    const [loading, setLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

                setTransaction(transactionData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching transaction data: ", err);
                setLoading(false);
            }
        };

        fetchTransaction();
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
        <AdminPanelPage>
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

            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <div className="card card-primary">
                        <div className="card-header">
                            <div className="card-tools-left">
                                <Link className="btn btn-tool" to="/transactions" title="Back">
                                    <i className="bi bi-arrow-left"></i>
                                </Link>
                            </div>
                            <div className="card-tools">
                                <Link className="btn btn-tool" to={`/transactions/${transaction.id}/edit`} title="Edit"><i className="bi bi-pencil-fill"></i></Link>
                                <button className="btn btn-tool" title="Delete" onClick={handleShowModal}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <div className="row mb-2">
                                        <div className="col-12">
                                            <div className="d-flex align-items-center">
                                                <CategoryNameAndIcon {...transaction.category.data} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <label htmlFor="date" className="form-label fw-bold">Amount</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">€</span>
                                            </div>
                                            <input className="form-control" type="text" name="amount" value={transaction.amount} disabled/>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <label htmlFor="date" className="form-label fw-bold">Date</label>
                                        <input className="form-control" type="date" name="date" value={transaction.date} disabled/>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="note" className="form-label fw-bold">Note</label>
                                            <div className="input-group">
                                                <textarea className="form-control" name="note" value={transaction.note ?? ''} disabled></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminPanelPage>
    );
}