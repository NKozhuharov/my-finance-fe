import React, {useEffect, useState} from "react";
import AdminPanelPage from "../../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../../hooks/useApiClient.js";
import {Link, useParams} from "react-router";


export default function WalletCreate() {

    const [wallet, setWallet] = useState({
        name: '',
        currency_id: '',
    });
    const [currencies, setCurrencies] = useState([]);
    const [walletErrors, setWalletErrors] = useState({});

    const api = useApiClient();

    useEffect(() => {


        const fetchCurrencies = async () => {
            try {
                const response = await api.get(`/currencies`);
                setCurrencies(response.data.data || []);
            } catch (err) {
                console.error("Error fetching currencies data: ", err);
            }
        };

        fetchCurrencies();
    }, [api]);

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <div className="card card-primary">

                        <div className="card-header">
                            <div className="card-tools-left">
                                <Link className="btn btn-tool" to="/wallets" title="Back">
                                    <i className="bi bi-arrow-left"></i>
                                </Link>
                            </div>
                            Edit Wallet
                            <div className="card-tools">
                                <button className="btn btn-tool fw-bold" type="submit" title="Save">SAVE</button>
                            </div>
                        </div>
                        <div className="card-body">

                        </div>
                        <div className="card-footer">

                        </div>
                    </div>
                </div>
            </div>
        </AdminPanelPage>
    );
}