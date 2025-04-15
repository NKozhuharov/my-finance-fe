import React, {useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate, useParams} from "react-router";
import {useAlert} from "@contexts/AlertContext.jsx";
import {Button, Card, CardBody, CardHeader, Col, FormLabel, Row, Spinner} from "react-bootstrap";
import CategorySelector from "@components/categories/category-selector/CategorySelector.jsx";
import Modal from "react-bootstrap/Modal";

export default function CategoryMerge() {
    const {categoryId} = useParams();

    const [targetCategory, setTargetCategory] = useState({
        id: null,
        name: '',
        type: null,
        icon: '',
    });
    const [selectedForMergeCategory, setSelectedForMergeCategory] = useState({
        id: null,
        name: '',
        type: null,
        icon: '',
    });
    const [loading, setLoading] = useState(true);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [formErrors, setFormErrors] = useState({});

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/categories/${categoryId}`);
                let categoryData = response.data.data;
                setTargetCategory(categoryData);
            } catch (err) {
                console.error("Error fetching category data: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
        document.title = "Merge Category";
    }, [api, categoryId]);

    const handleCategorySelect = (selectedCategory) => {
        setSelectedForMergeCategory(selectedCategory);
    };

    const handleCloseModal = () => setShowConfirmModal(false);
    const handleShowModal = () => setShowConfirmModal(true);

    const handleCategoryMerge = async () => {
        setFormErrors({});
        setLoading(true);

        try {
            await api.post(`/categories/merge`, {
                target_category_id: targetCategory.id,
                selected_for_merge_category_id: selectedForMergeCategory.id,
            });
            setAlert({variant: "success", text: "Categories merged successfully."});
            navigate(`/categories/${targetCategory.id}`);
        } catch (err) {
            setFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
        }
    }

    return (
        <>
            <Modal show={showConfirmModal} onHide={handleCloseModal} fullscreen={"sm-down"}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Merge</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="alert alert-danger">
                        Are you sure you want to merge those categories? This action cannot be undone.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleCategoryMerge}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row>
                <Col>
                    <Card className="card-primary">
                        <CardHeader>
                            <div className="card-tools-left">
                                <Link className="btn btn-tool" to={`/categories/${categoryId}`} title="Back">
                                    <i className="bi bi-arrow-left"></i>
                                </Link>
                            </div>
                            Merge Category
                            <div className="card-tools">
                                <Button className="btn-tool fw-bold"  disabled={loading || selectedForMergeCategory.id === null} onClick={handleShowModal}>CONFIRM MERGE</Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {loading ? (
                                <Spinner animation="border" variant="primary"/>
                            ) : (
                                <>
                                    <Row>
                                        <Col>
                                            <FormLabel htmlFor="target_category_id" className="fw-bold" column={true}>Target Category</FormLabel>
                                            <CategorySelector
                                                onlyParents={true}
                                                withChildren={false}
                                                type={targetCategory.type}
                                                preSelectedCategory={targetCategory}
                                                disabled={true}
                                            />
                                            {formErrors.target_category_id &&
                                                <span className="text-danger" role="alert">
                                                        <strong>{formErrors.target_category_id}</strong>
                                                    </span>
                                            }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormLabel htmlFor="selected_for_merge_category_id" className="fw-bold" column={true}>Select Category</FormLabel>
                                            <CategorySelector
                                                withChildren={true}
                                                type={targetCategory.type}
                                                onCategorySelect={handleCategorySelect}
                                            />
                                            {formErrors.selected_for_merge_category_id &&
                                                <span className="text-danger" role="alert">
                                                        <strong>{formErrors.selected_for_merge_category_id}</strong>
                                                    </span>
                                            }
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col>
                                            <div className="callout callout-info mb-0">
                                                <p>The selected category will be merged into the current one.</p>
                                                <p>All transactions associated with the given category and its children to will reference the current category.</p>
                                                <p>The specified category will be deleted once the merge is complete.</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}