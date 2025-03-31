import React, {useEffect, useState} from "react";
import AdminPanelPage from "../../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../../hooks/useApiClient.js";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import "datatables.net-rowgroup-bs5";
import {Link, useNavigate, useParams} from "react-router";
import {getIncomeExpenseColorClassFromType} from "../../../utils/helpers.js";
import CategoryNameAndIcon from "../category-name-and-icon/CategoryNameAndIcon.jsx";
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import {useAlert} from "../../../contexts/AlertContext.jsx";

DataTable.use(DT);

export default function CategoryShow() {
    const {categoryId} = useParams();

    const [category, setCategory] = useState({});

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

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

    const handleCloseModal = () => setShowDeleteModal(false);
    const handleShowModal = () => setShowDeleteModal(true);

    const handleCategoryDelete = (event) => {
        event.preventDefault();

        api.delete(`/categories/${categoryId}`, {})
            .then(() => {
                setAlert({variant: "success", text: "Category deleted successfully."});
                setShowDeleteModal(false);
                navigate(`/categories`);
            })
            .catch((error) => {
                setAlert({variant: "danger", text: error.response.data.message});
            }).finally(() => {
            setShowDeleteModal(false);
        })
    }

    return (
        <AdminPanelPage>
            <Modal show={showDeleteModal} onHide={handleCloseModal}>
                <form onSubmit={handleCategoryDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="alert alert-danger">
                            Are you sure you want to delete this category? This action cannot be undone.
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button type="submit" variant="danger">
                            Confirm
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <div className="card card-primary">
                        <div className="card-header">
                            <div className="card-tools-left">
                                <Link className="btn btn-tool" to="/categories" title="Back">
                                    <i className="bi bi-arrow-left"></i>
                                </Link>
                            </div>
                            Category <b>{category.name}</b>
                            <div className="card-tools">
                                <Link className="btn btn-tool" to={`/categories/${category.id}/edit`} title="Edit"><i className="bi bi-pencil-fill"></i></Link>
                                <button className="btn btn-tool" title="Delete" onClick={handleShowModal}>
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
                                                <strong className={getIncomeExpenseColorClassFromType(category.type)}>
                                                    {category.type}
                                                </strong>
                                                {category.parentCategory?.data.id ? (
                                                    <>
                                                        <i className="bi bi-arrow-right ps-2 pe-2 fw-bold"></i>
                                                        <Link to={`/categories/${category.parentCategory.data.id}`} className="text-decoration-none"
                                                              title={`View Category ${category.parentCategory.data.name}`}>
                                                            <strong className={getIncomeExpenseColorClassFromType(category.type)}>
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