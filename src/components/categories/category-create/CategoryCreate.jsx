import React, {useActionState, useContext, useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate} from "react-router";
import Select from "react-select";
import {useAlert} from "@contexts/AlertContext.jsx";
import {useCategoryIcons} from "@api/IconsApi.js";
import {CustomSingleValue, IconOption} from "@utils/IconComponents.jsx";
import CategorySelector from "@components/categories/category-selector/CategorySelector.jsx";
import {Button, Card, CardBody, CardHeader, Col, Form, Row, Spinner} from "react-bootstrap";
import {UserContext} from "@contexts/UserContext.jsx";

export default function CategoryCreate() {
    const parentId = new URLSearchParams(window.location.search).get('parentId');

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState({
        name: '',
        parent_category_id: '',
        parentCategory: {},
        type: null,
        icon: '',
    });
    const {categoryIcons} = useCategoryIcons();
    const categoryTypes = [
        {value: 'Income', label: 'Income'},
        {value: 'Expense', label: 'Expense'},
    ];

    const [formErrors, setFormErrors] = useState({});

    const {user} = useContext(UserContext);

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    useEffect(() => {
        //page not allowed for total wallet
        if (user.active_wallet_id === 0) {
            navigate(`/categories`);
        }

        const fetchCategory = async () => {
            try {
                const response = await api.get(`/categories/${parentId}`);
                let categoryData = response.data.data;
                setCategory({...category, type: categoryData.type, parent_category_id: categoryData.id, parentCategory: categoryData});
            } catch (err) {
                console.error("Error fetching category data: ", err);
            } finally {
                setLoading(false);
            }
        }

        if (parentId) {
            document.title = "Create Sub-Category";
            fetchCategory();
            return;
        }

        setLoading(false);
        document.title = "Create Category";
    }, [api, parentId]);

    const handleCategorySelect = (selectedCategory) => {
        category.parent_category_id = selectedCategory.id;
        category.parentCategory = selectedCategory;
    };

    const submitHandler = async () => {
        try {
            await api.post(`/categories`, category, {});
            setAlert({variant: "success", text: "Category created successfully."});
            navigate(`/categories`);
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
                                    <Link className="btn btn-tool" to={`/categories${parentId ? `/${parentId}` : ''}`} title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Create Category
                                <div className="card-tools">
                                    <Button className="btn-tool fw-bold" type="submit" title="Save" disabled={isPending}>SAVE</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                {loading ? (
                                    <Spinner animation="border" variant="primary"/>
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
                                                <Select
                                                    name="type"
                                                    options={categoryTypes}
                                                    value={categoryTypes.find(option => option.value === category.type) || null}
                                                    onChange={(selectedOption) => setCategory({...category, type: selectedOption.value})}
                                                    isSearchable={true}
                                                    placeholder="Please select"
                                                    required
                                                />
                                                {formErrors.type &&
                                                    <Form.Control.Feedback type="invalid">
                                                        <strong>{formErrors.type}</strong>
                                                    </Form.Control.Feedback>
                                                }
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
                                                    disabled={category.type === null}
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