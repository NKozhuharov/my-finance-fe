import {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {useApiClient} from "@hooks/useApiClient.js";
import {UserContext} from "@contexts/UserContext.jsx";
import WalletSwitcherRow from "@components/wallet-switcher/wallet-switcher-row/WalletSwitcherRow.jsx";
import {Spinner} from "react-bootstrap";

export default function WalletSwitcher() {
    const [show, setShow] = useState(false);
    const [wallets, setWallets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {user, userDataChangeHandler} = useContext(UserContext);

    const api = useApiClient();

    const handleCloseModal = () => setShow(false);
    const handleShowModal = async () => {
        setShow(true);
        try {
            const response = await api.get(`/wallets`);
            const walletCollection = response.data.data;
            if (walletCollection.length > 0) {
                const totalWalletResponse = await api.get(`/wallets/total-wallet`);
                walletCollection.push(totalWalletResponse.data.data);
            }
            setWallets(walletCollection);
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleWalletSwitch = (activeWallet) => {
        activeWallet.currency = activeWallet.currency.data;
        userDataChangeHandler({active_wallet_id: activeWallet.id, active_wallet: activeWallet});
        setShow(false);
    }

    return <>
        <Modal show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Select Wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <Spinner animation="border" variant="primary"/>
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
            <a className="nav-link" href="#" onClick={handleShowModal} title="Switch Wallet">
                <i className="bi bi-wallet"></i>&nbsp; {`${user.active_wallet.name} ${user.active_wallet.total_formatted}`}
            </a>
        </li>
    </>;
}
