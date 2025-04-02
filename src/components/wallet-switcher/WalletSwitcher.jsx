import {useContext, useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {useApiClient} from "@hooks/useApiClient.js";
import {UserContext} from "@contexts/UserContext.jsx";
import WalletSwitcherRow from "@components/wallet-switcher/wallet-switcher-row/WalletSwitcherRow.jsx";
import {FormText} from "react-bootstrap";

export default function WalletSwitcher() {
    const [show, setShow] = useState(false);
    const [activeWallet, setActiveWallet] = useState(null);
    const [wallets, setWallets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {user, userDataChangeHandler} = useContext(UserContext);

    const api = useApiClient();

    useEffect(() => {
        const fetchActiveWallet = async () => {
            try {
                const response = await api.get(`/wallets/${user.data.active_wallet_id}`);
                setActiveWallet(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        if (user.data.active_wallet_id) {
            fetchActiveWallet();
        }
    }, [api, user.data.active_wallet_id]);

    const handleCloseModal = () => setShow(false);
    const handleShowModal = async () => {
        setShow(true);
        try {
            const response = await api.get(`/wallets`);
            setWallets(response.data.data);
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleWalletSwitch = (activeWalletId) => {
        userDataChangeHandler({active_wallet_id: activeWalletId});
        setShow(false);
    }

    return <>
        <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Select Wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <FormText>Loading...</FormText>
                ) : wallets.length > 0 ? (
                    wallets.map(wallet => (
                        <WalletSwitcherRow
                            key={wallet.id}
                            {...wallet}
                            onWalletSwitch={handleWalletSwitch}
                        />
                    ))
                ) : (
                    <h3 className="no-articles">No wallets available</h3>
                )}
            </Modal.Body>
        </Modal>

        <li id="switch-wallet-button" className="nav-item">
            <a className="nav-link" href="#" onClick={handleShowModal}>
                <i className="bi bi-wallet"></i>&nbsp; {activeWallet ? `${activeWallet.name} ${activeWallet.total_formatted}` : 'Select Wallet'}
            </a>
        </li>
    </>;
}
