import React, {useActionState, useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useParams} from "react-router";
import Select from "react-select";
import {useAlert} from "@contexts/AlertContext.jsx";
import {useCategoryIcons} from "@api/IconsApi.js";
import {CustomSingleValue, IconOption} from "@utils/IconComponents.jsx";
import {Button, Card, CardBody, CardHeader, Col, Form, Row, Spinner} from "react-bootstrap";
import CategorySelector from "@components/categories/category-selector/CategorySelector.jsx";

export default function CategoryEdit() {
    const {categoryId} = useParams();

    const [category, setCategory] = useState({
        name: '',
        parent_category_id: '',
        parentCategory: {},
        type: null,
        icon: '',
    });
    const [loading, setLoading] = useState(true);

    const {categoryIcons} = useCategoryIcons();

    const [formErrors, setFormErrors] = useState({});

    const api = useApiClient();

    const {setAlert} = useAlert();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await api.get(`/categories/${categoryId}?resolve[]=parentCategory`);
                let categoryData = response.data.data;
                categoryData.parentCategory = categoryData.parentCategory.data.length > 0 ? categoryData.parentCategory.data : undefined;
                setCategory(categoryData);
            } catch (err) {
                console.error("Error fetching category data: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
        document.title = "Edit Category";
    }, [api, categoryId]);

    const handleCategorySelect = (selectedCategory) => {
        category.parent_category_id = selectedCategory.id;
        category.parentCategory = selectedCategory;
    };

    const submitHandler = async () => {
        setFormErrors({});

        try {
            await api.patch(`/categories/${categoryId}`, category, {});
            setAlert({variant: "success", text: "Category edited successfully."});
        } catch (err) {
            setFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, submitAction, isPending] = useActionState(submitHandler, {...category});

    return (
        <>
            <Row>
                <Col>
                    <form action={submitAction}>
                        <Card className="card-primary">
                            <CardHeader>
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to={`/categories/${categoryId}`} title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Edit Category
                                <div className="card-tools">
                                    <Button className="btn-tool fw-bold" type="submit" title="Save" disabled={isPending || loading}>SAVE</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <Spinner animation="border" variant="primary" />
                                ) : (
                                    <>
                                        <Row>
                                            <Col>
                                                <Form.Label htmlFor="name" className="fw-bold" column={true}>Name</Form.Label>
                                                <Form.Control
                                                    name="name"
                                                    value={category.name}
                                                    onChange={(e) => setCategory({...category, name: e.target.value})}
                                                    className={formErrors.name ? 'is-invalid' : ''}
                                                    placeholder="Name"
                                                    required
                                                />
                                                {formErrors.name &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.name}</strong>
                                                    </Form.Control.Feedback>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Label htmlFor="type" className="fw-bold" column={true}>Type</Form.Label>
                                                <input
                                                    type="text"
                                                    name="type"
                                                    value={category.type}
                                                    onChange={(e) => setCategory({...category, type: e.target.value})}
                                                    placeholder="Type"
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Label htmlFor="parent_category_id" className="fw-bold" column={true}>Parent Category</Form.Label>
                                                <CategorySelector
                                                    onlyParents={true}
                                                    withChildren={false}
                                                    onCategorySelect={handleCategorySelect}
                                                    type={category.type}
                                                    deselect={true}
                                                    preSelectedCategory={category.parentCategory}
                                                />
                                                {formErrors.parent_category_id &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.parent_category_id}</strong>
                                                    </Form.Control.Feedback>
                                                }
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Label htmlFor="icon" className="fw-bold" column={true}>Icon</Form.Label>
                                                <Select
                                                    name="icon"
                                                    options={categoryIcons}
                                                    value={categoryIcons.find(option => option.value === category.icon) || null}
                                                    onChange={(selectedOption) => setCategory({...category, icon: selectedOption.value})}
                                                    isSearchable={true}
                                                    placeholder="Please select"
                                                    components={{Option: IconOption, SingleValue: CustomSingleValue}}
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </form>
                </Col>
            </Row>
        </>
    );
}