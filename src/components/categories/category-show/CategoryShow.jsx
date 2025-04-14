import React, {useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate, useParams} from "react-router";
import {getIncomeExpenseColorClassFromType} from "@utils/helpers.js";
import CategoryNameAndIcon from "@components/categories/category-name-and-icon/CategoryNameAndIcon.jsx";
import Modal from "react-bootstrap/Modal";
import {Button, Card, CardBody, CardFooter, CardHeader, Col, Row, Spinner} from "react-bootstrap";
import {useAlert} from "@contexts/AlertContext.jsx";

export default function CategoryShow() {
    const {categoryId} = useParams();

    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    useEffect(() => {
        // Fetch data from the API
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/categories/${categoryId}?resolve[]=children&resolve[]=parentCategory&resolve[]=wallet`);

                setCategory(response.data.data);
            } catch (err) {
                console.error("Error fetching category data: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
        document.title = `View Category`;
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
        <>
            <Modal show={showDeleteModal} onHide={handleCloseModal} fullscreen={"sm-down"}>
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

            <Row>
                <Col>
                    <Card className="card-primary">
                        <CardHeader>
                            <div className="card-tools-left">
                                <Link className="btn btn-tool" to="/categories" title="Back">
                                    <i className="bi bi-arrow-left"></i>
                                </Link>
                            </div>
                            Category <b>{category.name}</b>
                            <div className="card-tools">
                                <Link className="btn btn-tool" to={`/categories/${category.id}/edit`} title="Edit"><i className="bi bi-pencil-fill"></i></Link>
                                <button className="btn btn-tool" title="Delete" onClick={handleShowModal} disabled={loading}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {loading ? (
                                <Spinner animation="border" variant="primary"/>
                            ) : (
                                <>
                                    <Row>
                                        <Col>
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
                                        </Col>
                                    </Row>
                                    <Row className="mt-1">
                                        <Col>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-arrow-return-right ps-3 pe-2 fw-bold"></i>
                                                <CategoryNameAndIcon {...category} />
                                            </div>
                                        </Col>
                                    </Row>

                                    {category.children?.data?.map((childCategory) => (
                                        <Row key={childCategory.id} className="mt-2">
                                            <Col>
                                                <Link to={`/categories/${childCategory.id}`} className="text-decoration-none" title={`View Category ${childCategory.name}`}>
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-arrow-return-right ps-5 pe-2 text-black"></i>
                                                        <CategoryNameAndIcon {...childCategory} />
                                                    </div>
                                                </Link>
                                            </Col>
                                        </Row>
                                    ))}
                                </>
                            )}
                        </CardBody>
                        <CardFooter>
                            {!category.parent_category_id &&
                                //only allowed for categories without parent, to discourage nesting
                                <Link to={`/categories/create?parentId=${category.id}`} className="btn btn-success float-start">
                                    Create Sub-Category
                                </Link>
                            }
                            <Link to="#TODO" className="btn btn-success float-end">
                                Merge Category
                            </Link>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </>
    );
}