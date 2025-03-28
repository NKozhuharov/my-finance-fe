import React, {useEffect, useState} from "react";
import AdminPanelPage from "../../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../../hooks/useApiClient.js";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import "datatables.net-rowgroup-bs5";
import {Link, useNavigate, useParams} from "react-router";
import {getIncomeExpenseColorClass} from "../../../utils/helpers.js";
import CategoryNameAndIcon from "../category-name-and-icon/CategoryNameAndIcon.jsx";

DataTable.use(DT);

export default function CategoryShow() {
    const {categoryId} = useParams();

    const [category, setCategory] = useState({});

    const api = useApiClient();

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from the API
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/categories/${categoryId}?resolve[]=children&resolve[]=parentCategory`);

                setCategory(response.data.data);
            } catch (err) {
                console.error("Error fetching category data: ", err);
            }
        };

        fetchCategory();
    }, [api, categoryId]);

    const handleCategoryDelete = (event) => {
        event.preventDefault();

        // todo

        navigate(`/categories`);
    }

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <div className="card card-primary">
                        <div className="card-header">
                            <div className="card-tools-left">
                                <Link className="btn btn-tool" to={-1} title="Back">
                                    <i className="bi bi-arrow-left"></i>
                                </Link>
                            </div>
                            Category <b>{category.name}</b>
                            <div className="card-tools">
                                <Link className="btn btn-tool" to={`/categories/${category.id}/edit`} title="Edit"><i className="bi bi-pencil-fill"></i></Link>
                                <button className="btn btn-tool" title="Delete" onClick={handleCategoryDelete}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row mb-2">
                                <div className="col-12">
                                    <div className="form-inline">
                                        <h5>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-arrow-right pe-2 fw-bold"></i>
                                                <strong className={getIncomeExpenseColorClass(category.type)}>
                                                    {category.type}
                                                </strong>
                                                {category.parentCategory?.data.id ? (
                                                    <>
                                                        <i className="bi bi-arrow-right ps-2 pe-2 fw-bold"></i>
                                                        <Link to={`/categories/${category.parentCategory.data.id}`} className="text-decoration-none" title={`View Category ${category.parentCategory.data.name}`}>
                                                            <strong className={getIncomeExpenseColorClass(category.type)}>
                                                                {category.parentCategory.data.name}
                                                            </strong>
                                                        </Link>
                                                    </>
                                                ) : ''}
                                            </div>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-12">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-arrow-return-right ps-3 pe-2 fw-bold"></i>
                                        <CategoryNameAndIcon {...category} />
                                    </div>
                                </div>
                            </div>

                            {category.children?.data?.map((childCategory) => (
                                <div key={childCategory.id} className="row mb-2">
                                    <div className="col-12">
                                        <Link to={`/categories/${childCategory.id}`} className="text-decoration-none" title={`View Category ${childCategory.name}`}>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-arrow-return-right ps-5 pe-2 text-black"></i>
                                                <CategoryNameAndIcon {...childCategory} />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="card-footer">
                            <Link to="#TODO" className="btn btn-success float-start">
                                Create Sub-Category
                            </Link>
                            <Link to="#TODO" className="btn btn-success float-end">
                                Merge Category
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPanelPage>
    );
}