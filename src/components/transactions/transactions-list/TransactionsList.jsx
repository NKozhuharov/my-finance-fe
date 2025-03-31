import React, {useContext, useEffect, useState} from "react";
import AdminPanelPage from "../../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../../hooks/useApiClient.js";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import "datatables.net-rowgroup-bs5";
import {Link, useNavigate} from "react-router";
import {UserContext} from "../../../contexts/UserContext.jsx";
import CategoryNameCell from "../../categories/category-name-cell/CategoryNameCell.jsx";
import TransactionAmountCell from "../transaction-amount-cell/TransactionAmountCell.jsx";
import {endOfMonth, format, startOfMonth, subMonths, addMonths} from 'date-fns';

DataTable.use(DT);

export default function TransactionsList() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const api = useApiClient();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const [createdAtFrom, setCreatedAtFrom] = useState("2025-01-01");
    const [createdAtTo, setCreatedAtTo] = useState("2025-01-31");

    useEffect(() => {
        // Fetch data from the API
        const fetchTransactions = async () => {
            try {
                const response = await api.get(`/transactions?resolve[]=category&limit=all&filters[date][gte]=${createdAtFrom}&filters[date][lte]=${createdAtTo}`);

                setTransactions(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching transactions data: ", err);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [api, user.data.active_wallet_id, createdAtFrom, createdAtTo]);

    const handleSetPrevMonth = () => {
        setCreatedAtFrom((prevState) => {
            const firstDayPrevMonth = startOfMonth(subMonths(new Date(prevState), 1));
            return format(firstDayPrevMonth, 'yyyy-MM-dd');
        });
        setCreatedAtTo((prevState) => {
            const lastDayPrevMonth = endOfMonth(subMonths(new Date(prevState), 1));
            return format(lastDayPrevMonth, 'yyyy-MM-dd');
        });
    }

    const handleSetNextMonth = () => {
        setCreatedAtFrom((prevState) => {
            const firstDayPrevMonth = startOfMonth(addMonths(new Date(prevState), 1));
            return format(firstDayPrevMonth, 'yyyy-MM-dd');
        });
        setCreatedAtTo((prevState) => {
            const lastDayPrevMonth = endOfMonth(addMonths(new Date(prevState), 1));
            return format(lastDayPrevMonth, 'yyyy-MM-dd');
        });
    }

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <div className="card card-primary">
                        <div className="card-header">
                            Transactions
                            <div className="card-tools">
                                <Link to="/transactions/create" className="btn btn-tool fw-bold" title="Create Transaction">
                                    <i className="bi bi-plus"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="form-group col-6 col-md-3 col-lg-2">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">From</span>
                                        </div>
                                        <input type="date" name="created_at_from" value={createdAtFrom} className="form-control" onChange={(e) => setCreatedAtFrom(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="form-group col-6 col-md-3 col-lg-2">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">To</span>
                                        </div>
                                        <input type="date" name="created_at_to" value={createdAtTo} className="form-control" onChange={(e) => setCreatedAtTo(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="form-group col-6 col-md-3 col-lg-1">
                                    <button type="button" id="set-prev-month" className="btn btn-primary w-100" title="Previous month" onClick={handleSetPrevMonth}>
                                        <i className="bi bi-arrow-left"></i>
                                    </button>
                                </div>
                                <div className="form-group col-6 col-md-3 col-lg-1">
                                    <button type="button" id="set-next-month" className="btn btn-primary w-100" title="Next month" onClick={handleSetNextMonth}>
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <DataTable
                                    className="table table-striped table-no-bordered table-hover w-100 datatable responsive clickable-table"
                                    data={transactions}
                                    slots={{
                                        0: (data, row) => (
                                            // remove parent_category_id, no arrows here
                                            <CategoryNameCell {...{...row.category.data, parent_category_id: undefined}} />
                                        ),
                                        1: (data, row) => (
                                            <TransactionAmountCell amount={row.amount} formattedtAmount={row.amount_formatted}/>
                                        )
                                    }}
                                    options={{
                                        searching: false,
                                        ordering: false,
                                        paging: false,
                                        info: false,
                                        rowGroup: {
                                            dataSrc: 'date'
                                        },
                                        rowCallback: (row, data) => {

                                            // Add a click event to each row
                                            row.onclick = () => {
                                                navigate(`/transactions/${data.id}`);
                                            };
                                        },
                                    }}

                                >
                                    <thead>
                                    </thead>
                                </DataTable>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminPanelPage>
    );
}