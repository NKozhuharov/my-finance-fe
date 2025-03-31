import React, {useContext, useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import "datatables.net-rowgroup-bs5";
import {Link, useNavigate} from "react-router";
import CategoryNameCell from "@components/categories/category-name-cell/CategoryNameCell.jsx";
import {UserContext} from "@contexts/UserContext.jsx";

DataTable.use(DT);

export default function CategoriesList() {
    const [categories, setCategories] = useState([]); // State to store table data
    const [loading, setLoading] = useState(true); // Track loading state

    const api = useApiClient();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    useEffect(() => {
        // Fetch data from the API
        const fetchCategories = async () => {
            try {
                let url = `/categories?limit=all&filters[parent_category_id][is]=null&resolve[]=children&orderby=name&sort=asc`;
                if (!user.data.active_wallet_id) {
                    //resolve wallet to show it in the list of categories
                    url += '&resolve[]=wallet';
                }
                const response = await api.get(url);
                const categoryArray = [];
                (response.data.data || []).forEach((category) => {
                    categoryArray.push(category);
                    if (category.children.data) {
                        category.children.data.forEach((childCategory) => {
                            categoryArray.push(childCategory);
                        });
                    }
                });

                categoryArray.sort((a, b) => a.type.localeCompare(b.type, undefined, {sensitivity: 'base'}));
                setCategories(categoryArray); // Save fetched data into state
                setLoading(false); // Turn off loading
            } catch (err) {
                console.error("Error fetching category data: ", err);
                setLoading(false);
            }
        };

        fetchCategories();
        document.title = "Categories";
    }, [api, user.data.active_wallet_id]); // Run once on component mount

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <div className="card card-primary">
                        <div className="card-header">
                            Categories
                            <div className="card-tools">
                                <Link to="/categories/create" className="btn btn-tool fw-bold" title="Create Category">
                                    <i className="bi bi-plus"></i>
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <p>Loading...</p> // If loading, show a spinner or message
                            ) : (
                                <DataTable
                                    className="table table-striped table-no-bordered table-hover w-100 datatable responsive clickable-table"
                                    data={categories}
                                    slots={{
                                        0: (data, row) => (
                                            <CategoryNameCell {...row} />
                                        )
                                    }}
                                    options={{
                                        searching: false,
                                        ordering: false,
                                        paging: false,
                                        info: false,
                                        rowGroup: {
                                            dataSrc: 'type'
                                        },
                                        rowCallback: (row, data) => {
                                            // Add a click event to each row
                                            row.onclick = () => {
                                                navigate(`/categories/${data.id}`);
                                            };
                                        },
                                    }}

                                >
                                    <thead>
                                    </thead>
                                </DataTable>
                            )}
                        </div>
                        <div className="card-footer">
                            <Link to="/categories/create" className="btn btn-success float-end">
                                Create Category
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPanelPage>
    );
}