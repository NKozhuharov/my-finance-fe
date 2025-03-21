import React, {useEffect, useState} from "react";
import AdminPanelPage from "../../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../../hooks/useApiClient.js";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import {Link, useNavigate} from "react-router";

DataTable.use(DT);

export default function WalletsList() {
    const [wallets, setWallets] = useState([]); // State to store table data
    const [loading, setLoading] = useState(true); // Track loading state

    const api = useApiClient();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from the API
        const fetchWallets = async () => {
            try {
                const response = await api.get(`/wallets`);
                setWallets(response.data.data || []); // Save fetched data into state
                setLoading(false); // Turn off loading
            } catch (err) {
                console.error("Error fetching wallet data: ", err);
                setLoading(false);
            }
        };

        fetchWallets();
    }, [api]); // Run once on component mount

    // Define DataTable columns
    const columns = [
        {
            title: "Name",
            data: "name",
            render: (data, type, row) => {
                return `<div class="d-flex align-items-center">
                            <div class="icon-container">
                                <img class="category-icon" src="${import.meta.env.VITE_ICONS_BASE_URL}${row.icon}" alt="No Icon"/>
                            </div>
                            <span class="fw-bold ms-2">${row.name}</span>
                        </div>`;
            },
        },
        {
            title: "Balance",
            data: "total_formatted",
            className: "text-end",
        },
    ];

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <div className="card card-primary">
                        <div className="card-header">Wallets</div>
                        <div className="card-body">
                            {loading ? (
                                <p>Loading...</p> // If loading, show a spinner or message
                            ) : (
                                <DataTable
                                    className="table table-striped table-no-bordered table-hover w-100 datatable responsive clickable-table"
                                    data={wallets}
                                    options={{
                                        searching: false,
                                        ordering: false,
                                        paging: false,
                                        info: false,
                                        columns: columns,
                                        rowCallback: (row, data) => {
                                            // Add a click event to each row
                                            row.onclick = () => {
                                                navigate(`/wallets/${data.id}/edit`);
                                            };
                                        },
                                    }}

                                >
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th className="text-end">Balance</th>
                                    </tr>
                                    </thead>
                                </DataTable>
                            )}
                        </div>
                        <div className="card-footer">
                            <Link to="/wallets/create" className="btn btn-success float-end">
                                Create Wallet
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPanelPage>
    );
}