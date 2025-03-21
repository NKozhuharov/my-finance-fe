import React, {useActionState, useEffect, useState} from "react";
import AdminPanelPage from "../../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../../hooks/useApiClient.js";
import {Link, useNavigate, useParams} from "react-router";
import Select, {components} from "react-select";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import {useAlert} from "../../../contexts/AlertContext.jsx";

const IconOption = (props) => {
    return (
        <components.Option {...props}>
            <div className="icon-option">
                <img src={props.data.url} alt="icon.text"/>&nbsp;{props.data.label}
            </div>
        </components.Option>
    );
};

// Custom SingleValue component (for selected item)
const CustomSingleValue = (props) => {
    return (
        <components.SingleValue {...props}>
            <div className="icon-option">
                <img src={props.data.url} alt="icon.text"/>&nbsp;{props.data.label}
            </div>
        </components.SingleValue>
    );
};

export default function WalletEdit() {
    const {walletId} = useParams();

    const [wallet, setWallet] = useState({
        name: '',
        currency_id: '',
        icon: '',
    });
    const [currencies, setCurrencies] = useState([]);
    const [icons, setIcons] = useState([]);

    const [walletEditErrors, setWalletEditErrors] = useState({});

    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
            }
        };

        const fetchCurrencies = async () => {
            try {
                const response = await api.get(`/currencies`);
                setCurrencies(response.data.data.map(currency => {
                    return {
                        value: currency.id,
                        label: currency.name,
                    }
                }));
            } catch (err) {
                console.error("Error fetching currencies data: ", err);
            }
        };
        const fetchWalletIcons = async () => {
            try {
                const response = await api.get(`/wallets/icons`);
                setIcons(response.data.data.map(icon => {
                    return {
                        value: icon,
                        url: `${import.meta.env.VITE_ICONS_BASE_URL}${icon}`,
                        label: icon.replace('/images/icons/wallet/', '').replace('.png', '').charAt(0).toUpperCase() + icon.replace('/images/icons/wallet/', '').replace('.png', '').slice(1),
                    }
                }));
            } catch (err) {
                console.error("Error fetching currencies data: ", err);
            }
        };

        fetchWallet();
        fetchCurrencies();
        fetchWalletIcons();
    }, [api, walletId]);

    const walletEditHandler = async (_, formData) => {
        setWalletEditErrors({});
        const values = Object.fromEntries(formData);

        try {
            await api.patch(`/wallets/${walletId}`, values, {});
            setAlert({variant: "success", text: "Wallet edited successfully."});
        } catch (err) {
            setWalletEditErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, editAction, isPending] = useActionState(walletEditHandler, {...wallet});

    const handleCloseModal = () => setShowDeleteModal(false);
    const handleShowModal = () => setShowDeleteModal(true);
    const handleConfirmModal = (event) => {
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
        <AdminPanelPage>
            <Modal show={showDeleteModal} onHide={handleCloseModal}>
                <form onSubmit={handleConfirmModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="alert alert-danger">
                            Are you sure you want to delete this wallet? This action cannot be undone.
                        </div>
                        <input
                            type="text"
                            name="confirmation"
                            className="form-control"
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

            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <form action={editAction}>
                        <div className="card card-primary">
                            <div className="card-header">
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to="/wallets" title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Edit Wallet
                                <div className="card-tools">
                                    <button className="btn btn-tool fw-bold" type="submit" title="Save" disabled={isPending}>SAVE</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="name" className="form-label fw-bold">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={wallet.name}
                                            onChange={(e) => setWallet({...wallet, name: e.target.value})}
                                            className={`form-control${walletEditErrors.name ? ' is-invalid' : ''}`}
                                            placeholder="Name"

                                        />
                                        {walletEditErrors.name &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{walletEditErrors.name}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="currency_id" className="form-label fw-bold">Currency</label>
                                        <Select
                                            name="currency_id"
                                            options={currencies}
                                            value={currencies.find(option => option.value === wallet.currency_id) || null}
                                            onChange={(selectedOption) => setWallet({...wallet, currency_id: selectedOption.value})}
                                            isSearchable={true}
                                            placeholder="Please select"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="currency_id" className="form-label fw-bold">Icon</label>
                                        <Select
                                            name="icon"
                                            options={icons}
                                            value={icons.find(option => option.value === wallet.icon) || null}
                                            onChange={(selectedOption) => setWallet({...wallet, icon: selectedOption.value})}
                                            isSearchable={true}
                                            placeholder="Please select"
                                            components={{Option: IconOption, SingleValue: CustomSingleValue}} // Use the custom Option
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <a href="#" className="btn btn-danger float-end" type="button" title="Delete Wallet" onClick={handleShowModal}>
                                    <i className="bi bi-trash"></i>&nbsp;Delete Wallet
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPanelPage>
    )
        ;
}