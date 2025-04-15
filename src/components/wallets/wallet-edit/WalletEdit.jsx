import React, {useActionState, useContext, useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate, useParams} from "react-router";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import {Button, Card, CardBody, CardHeader, Col, Form, Row, Spinner} from "react-bootstrap";
import {useAlert} from "@contexts/AlertContext.jsx";
import {useCurrencies} from "@api/CurrenciesApi.js";
import {useWalletIcons} from "@api/IconsApi.js";
import {CustomSingleValue, IconOption} from "@utils/IconComponents.jsx";
import {UserContext} from "@contexts/UserContext.jsx";

export default function WalletEdit() {
    const {walletId} = useParams();

    const [wallet, setWallet] = useState({
        name: '',
        currency_id: '',
        icon: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const {currencies} = useCurrencies();
    const {walletIcons} = useWalletIcons();

    const {user, userDataChangeHandler} = useContext(UserContext);

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await api.get(`/wallets/${walletId}`);
                setWallet(response.data.data || []);
            } catch (err) {
                console.error("Error fetching wallet data: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
        document.title = "Edit Wallet";
    }, [api, walletId]);

    const walletEditHandler = async (_, formData) => {
        setFormErrors({});
        const values = Object.fromEntries(formData);

        try {
            const response = await api.patch(`/wallets/${walletId}`, values, {});
            if (parseInt(walletId) === parseInt(user.active_wallet_id)) {
                const activeWallet = response.data.data;
                userDataChangeHandler({active_wallet_id: activeWallet.id, active_wallet: activeWallet});
            }
            setAlert({variant: "success", text: "Wallet edited successfully."});
        } catch (err) {
            setFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, submitAction, isPending] = useActionState(walletEditHandler, {...wallet});

    const handleCloseModal = () => setShowDeleteModal(false);
    const handleShowModal = () => setShowDeleteModal(true);
    const handleWalletDeletion = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const deleteConfirmationValue = formData.get('confirmation');

        if (deleteConfirmationValue !== 'DELETE') {
            return;
        }

        api.delete(`/wallets/${walletId}`, {})
            .then(() => {
                setAlert({variant: "success", text: "Wallet deleted successfully."});
                setShowDeleteModal(false);
                navigate(`/wallets`);
            })
            .catch((error) => {
                setAlert({variant: "danger", text: error.response.data.message});
            }).finally(() => {
            setShowDeleteModal(false);
        })
    }

    return (
        <>
            <Modal show={showDeleteModal} onHide={handleCloseModal} fullscreen={"sm-down"}>
                <form onSubmit={handleWalletDeletion}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="alert alert-danger">
                            Are you sure you want to delete this wallet? This action cannot be undone.
                        </div>
                        <Form.Control
                            name="confirmation"
                            placeholder="Please type 'DELETE' to confirm"
                            required
                        />
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
                    <form action={submitAction}>
                        <Card className="card-primary">
                            <CardHeader>
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to="/wallets" title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Edit Wallet
                                <div className="card-tools">
                                    <button className="btn btn-tool fw-bold" type="submit" title="Save" disabled={isPending || loading}>SAVE</button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <Spinner animation="border" variant="primary"/>
                                ) : (
                                    <>
                                        <Row className="row mb-2">
                                            <Col>
                                                <Form.Label htmlFor="name" className="fw-bold" column={true}>Name</Form.Label>
                                                <Form.Control
                                                    name="name"
                                                    value={wallet.name}
                                                    onChange={(e) => setWallet({...wallet, name: e.target.value})}
                                                    className={formErrors.name ? 'is-invalid' : ''}
                                                    placeholder="Name"
                                                    required
                                                />
                                                {formErrors.name &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.name}</strong>
                                                    </Form.Control.Feedback>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Label htmlFor="currency_id" className="fw-bold" column={true}>Currency</Form.Label>
                                                <Select
                                                    name="currency_id"
                                                    options={currencies}
                                                    value={currencies.find(option => option.value === wallet.currency_id) || null}
                                                    onChange={(selectedOption) => setWallet({...wallet, currency_id: selectedOption.value})}
                                                    isSearchable={true}
                                                    placeholder="Please select"
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Label htmlFor="currency_id" className="fw-bold" column={true}>Icon</Form.Label>
                                                <Select
                                                    name="icon"
                                                    options={walletIcons}
                                                    value={walletIcons.find(option => option.value === wallet.icon) || null}
                                                    onChange={(selectedOption) => setWallet({...wallet, icon: selectedOption.value})}
                                                    isSearchable={true}
                                                    placeholder="Please select"
                                                    components={{Option: IconOption, SingleValue: CustomSingleValue}}
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </CardBody>
                            <div className="card-footer">
                                <Button className="btn btn-danger float-end" title="Delete Wallet" onClick={handleShowModal}
                                        disabled={isPending || loading || parseInt(walletId) === parseInt(user.active_wallet_id)}>
                                    <i className="bi bi-trash"></i>&nbsp;Delete Wallet
                                </Button>
                            </div>
                        </Card>
                    </form>
                </Col>
            </Row>
        </>
    );
}