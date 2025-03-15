import {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {Link} from "react-router";

export default function WalletSwitcher() {
    const [show, setShow] = useState(false);

    const handleCloseModal = () => setShow(false);
    const handleShowModal = () => setShow(true);

    return <>
        <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Select Wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row my-3">
                    <div className="col-12">
                        <Link
                            to="/wallets/set-active-wallet?wallet_id=1"
                            className="d-flex align-items-center justify-content-between text-decoration-none"
                        >
                            <div className="d-flex align-items-center">
                                <div className="icon-container me-2">
                                    <img
                                        className="category-icon"
                                        src="https://myf.netcube.eu/images/icons/wallet/default.png"
                                        alt="No Icon"
                                        style={{width: "32px", height: "32px"}}
                                    />
                                </div>
                                <span className="fw-bold wallet-name">Luke Leva</span>
                            </div>
                            <b className="ms-auto">43,883.50лв.</b>
                        </Link>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

        <li id="switch-wallet-button" className="nav-item">
            <a className="nav-link" href="#" onClick={handleShowModal}>
                <i className="bi bi-wallet"></i>&nbsp; Wallet Name 83,357.62€
            </a>
        </li>
    </>;
}