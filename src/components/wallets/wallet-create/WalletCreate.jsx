import React, {useActionState, useState} from "react";
import AdminPanelPage from "../../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../../hooks/useApiClient.js";
import {Link, useNavigate} from "react-router";
import {useCurrencies} from "../../../api/CurrenciesApi.js";
import {useWalletIcons} from "../../../api/IconsApi.js";
import {useAlert} from "../../../contexts/AlertContext.jsx";
import Select, {components} from "react-select";
import {CustomSingleValue, IconOption} from "../../../utils/IconComponents.jsx";


export default function WalletCreate() {

    const [wallet, setWallet] = useState({
        name: '',
        currency_id: '',
        icon: '',
    });
    const {currencies} = useCurrencies();
    const {walletIcons} = useWalletIcons();

        const [walletFormErrors, setWalletFormErrors] = useState({});

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    const walletCreateHandler = async (_, formData) => {
        setWalletFormErrors({});
        const values = Object.fromEntries(formData);

        try {
            await api.post(`/wallets`, values);
            setAlert({variant: "success", text: "Wallet created successfully."});
            navigate(`/wallets`);
        } catch (err) {
            setWalletFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, createAction, isPending] = useActionState(walletCreateHandler, {...wallet});

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <form action={createAction}>
                        <div className="card card-primary">
                            <div className="card-header">
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to="/wallets" title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Create Wallet
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
                                            className={`form-control${walletFormErrors.name ? ' is-invalid' : ''}`}
                                            placeholder="Name"

                                        />
                                        {walletFormErrors.name &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{walletFormErrors.name}</strong>
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
                                            className={`${walletFormErrors.currency_id ? ' is-invalid' : ''}`}
                                            isSearchable={true}
                                            placeholder="Please select"

                                        />
                                        {walletFormErrors.currency_id &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{walletFormErrors.currency_id}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="currency_id" className="form-label fw-bold">Icon</label>
                                        <Select
                                            name="icon"
                                            options={walletIcons}
                                            value={walletIcons.find(option => option.value === wallet.icon) || null}
                                            onChange={(selectedOption) => setWallet({...wallet, icon: selectedOption.value})}
                                            className={`${walletFormErrors.currency_id ? ' is-invalid' : ''}`}
                                            isSearchable={true}
                                            placeholder="Please select"
                                            components={{Option: IconOption, SingleValue: CustomSingleValue}} // Use the custom Option

                                        />
                                        {walletFormErrors.icon &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{walletFormErrors.icon}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPanelPage>
    );
}