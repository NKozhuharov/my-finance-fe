import React, {useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import {Link, useNavigate} from "react-router";
import WalletNameCell from "@components/wallets/wallet-name-cell/WalletNameCell.jsx";
import {Card, CardBody, CardFooter, CardHeader, Col, FormText, Row} from "react-bootstrap";

export default function WalletsList() {
    DataTable.use(DT);

    const [wallets, setWallets] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const api = useApiClient();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await api.get(`/wallets?aggregate[]=total`);
                const responseData = response.data;
                setWallets(responseData.data || []);
                setTotal(responseData.meta.aggregate.total.total_formatted)
            } catch (err) {
                console.error("Error fetching wallet data: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallets();
        document.title = "Wallets";
    }, [api]); // Run once on component mount

    // Define DataTable columns
    const columns = [
        {
            title: "Name",
            data: "name",
        },
        {
            title: "Balance",
            data: "total_formatted",
            className: "text-end",
        },
    ];

    return (
        <AdminPanelPage>
            <Row>
                <Col>
                    <Card className="card-primary">
                        <CardHeader>
                            Wallets
                        </CardHeader>
                        <CardBody>
                            {loading ? (
                                <FormText>Loading...</FormText>
                            ) : (
                                <DataTable
                                    className="table table-striped table-no-bordered table-hover w-100 datatable responsive clickable-table"
                                    data={wallets}
                                    slots={{
                                        0: (data, row) => (
                                            <WalletNameCell {...row} />
                                        )
                                    }}
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
                                        footerCallback: function () {
                                            this.find('tfoot tr:eq(0) th:eq(1)').html(total);
                                        }
                                    }}

                                >
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th className="text-end">Balance</th>
                                    </tr>
                                    </thead>
                                    <tfoot>
                                    <tr>
                                        <th>Total</th>
                                        <th className="text-right"></th>
                                    </tr>
                                    </tfoot>
                                </DataTable>
                            )}
                        </CardBody>
                        <CardFooter>
                            <Link to="/wallets/create" className="btn btn-success float-end">
                                Create Wallet
                            </Link>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </AdminPanelPage>
    );
}