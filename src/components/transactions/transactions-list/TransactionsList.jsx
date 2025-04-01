import React, {useContext, useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import "datatables.net-rowgroup-bs5";
import {Link, useNavigate} from "react-router";
import {UserContext} from "@contexts/UserContext.jsx";
import CategoryNameCell from "@components/categories/category-name-cell/CategoryNameCell.jsx";
import TransactionAmountCell from "@components/transactions/transaction-amount-cell/TransactionAmountCell.jsx";
import {addMonths, endOfMonth, format, startOfMonth, subMonths} from 'date-fns';
import {Button, Card, CardBody, CardHeader, Col, FormControl, FormGroup, FormText, InputGroup, Row} from "react-bootstrap";
import InputGroupText from "react-bootstrap/InputGroupText";

export default function TransactionsList() {
    DataTable.use(DT);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const api = useApiClient();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const [createdAtFrom, setCreatedAtFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [createdAtTo, setCreatedAtTo] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                let url = `/transactions?resolve[]=category&limit=all&filters[date][gte]=${createdAtFrom}&filters[date][lte]=${createdAtTo}`;
                if (!user.data.active_wallet_id) {
                    //resolve wallet to show it in the list of categories
                    url += '&resolve[]=category-wallet';
                }
                const response = await api.get(url);

                setTransactions(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching transactions data: ", err);
                setLoading(false);
            }
        };

        fetchTransactions();
        document.title = "Transactions";
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
            <Row>
                <Col>
                    <Card className="card-primary">
                        <CardHeader>
                            Transactions
                            <div className="card-tools">
                                <Link to="/transactions/create" className="btn btn-tool fw-bold" title="Create Transaction">
                                    <i className="bi bi-plus"></i>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <FormGroup className="col-6 col-md-3 col-lg-2">
                                    <InputGroup>
                                        <div className="input-group-prepend">
                                            <InputGroupText>From</InputGroupText>
                                        </div>
                                        <FormControl type="date" name="created_at_from" value={createdAtFrom} className="form-control" onChange={(e) => setCreatedAtFrom(e.target.value)}/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="col-6 col-md-3 col-lg-2">
                                    <InputGroup>
                                        <div className="input-group-prepend">
                                            <InputGroupText>To</InputGroupText>
                                        </div>
                                        <FormControl type="date" name="created_at_to" value={createdAtTo} className="form-control" onChange={(e) => setCreatedAtTo(e.target.value)}/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="col-6 col-md-3 col-lg-1">
                                    <Button className="btn-primary w-100" title="Previous month" onClick={handleSetPrevMonth}>
                                        <i className="bi bi-arrow-left"></i>
                                    </Button>
                                </FormGroup>
                                <FormGroup className="col-6 col-md-3 col-lg-1">
                                    <Button className="btn-primary w-100" title="Next month" onClick={handleSetNextMonth}>
                                        <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </FormGroup>
                            </Row>

                            {loading ? (
                                <FormText>Loading...</FormText>
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
                                            <TransactionAmountCell amount={row.amount} formattedAmount={row.amount_formatted}/>
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
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </AdminPanelPage>
    );
}
