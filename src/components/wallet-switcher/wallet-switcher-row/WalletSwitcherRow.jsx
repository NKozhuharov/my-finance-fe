import {useApiClient} from "@hooks/useApiClient.js";
import {useContext} from "react";
import {UserContext} from "@contexts/UserContext.jsx";

export default function WalletSwitcherRow(
    {
        id,
        name,
        icon,
        total_formatted,
        onWalletSwitch
    }
) {
    const {user} = useContext(UserContext);

    const api = useApiClient();

    const handleWalletSwitch = async () => {
        //do nothing if the active wallet is selected
        if (user.data.active_wallet_id === id) {
            return;
        }

        try {
            await api.patch(`/wallets/set-active-wallet`, {wallet_id: id});

            // Call to close modal
            onWalletSwitch(id);
        } catch (error) {
            console.error("Failed to switch wallet:", error);
        }
    };

    return (
        <div className="row my-3">
            <div className="col-12">
                <div
                    className="d-flex align-items-center justify-content-between text-decoration-none"
                    onClick={handleWalletSwitch}
                    role="button"
                    style={{cursor: user.data.active_wallet_id !== id ? "pointer" : "default"}}
                >
                    <div className="d-flex align-items-center">
                        <div className="icon-container me-2">
                            <img
                                className="category-icon"
                                src={`${import.meta.env.VITE_ICONS_BASE_URL}${icon}`}
                                alt="No Icon"
                                style={{width: "32px", height: "32px"}}
                            /></div>
                        <span className={`fw-bold ${user.data.active_wallet_id !== id ? ' text-primary' : ''}`}>{name}</span>
                    </div>
                    <b className="ms-auto">{total_formatted}</b>
                </div>
            </div>
        </div>
    );
}
