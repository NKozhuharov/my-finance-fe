import React, {useActionState, useContext, useEffect, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate} from "react-router";
import Select from "react-select";
import {useAlert} from "@contexts/AlertContext.jsx";
import {useCategoryIcons} from "@api/IconsApi.js";
import {CustomSingleValue, IconOption} from "@utils/IconComponents.jsx";
import CategorySelector from "@components/categories/category-selector/CategorySelector.jsx";
import {Button, Card, CardBody, CardHeader, Col, FormControl, FormLabel, Row} from "react-bootstrap";
import {UserContext} from "@contexts/UserContext.jsx";

export default function CategoryCreate() {
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

        document.title = "Create Category";
    });

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
                                    <Link className="btn btn-tool" to={`/categories`} title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Create Category
                                <div className="card-tools">
                                    <Button className="btn-tool fw-bold" type="submit" title="Save" disabled={isPending}>SAVE</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <FormLabel htmlFor="name" className="fw-bold" column={true}>Name</FormLabel>
                                        <FormControl
                                            name="name"
                                            value={category.name}
                                            onChange={(e) => setCategory({...category, name: e.target.value})}
                                            className={formErrors.name ? ' is-invalid' : ''}
                                            placeholder="Name"
                                            required
                                        />
                                        {formErrors.name &&
                                            <span className="text-danger" role="alert">
                                                <strong>{formErrors.name}</strong>
                                            </span>
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormLabel htmlFor="type" className="fw-bold" column={true}>Type</FormLabel>
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
                                            <span className="text-danger" role="alert">
                                                <strong>{formErrors.type}</strong>
                                            </span>
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormLabel htmlFor="parent_category_id" className="fw-bold" column={true}>Parent Category</FormLabel>
                                        <CategorySelector
                                            onlyParents={true}
                                            withChildren={false}
                                            onCategorySelect={handleCategorySelect}
                                            type={category.type}
                                            disabled={category.type === null}
                                        />
                                        {formErrors.parent_category_id &&
                                            <span className="text-danger" role="alert">
                                                <strong>{formErrors.parent_category_id}</strong>
                                            </span>
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormLabel htmlFor="icon" className="fw-bold" column={true}>Icon</FormLabel>
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
                            </CardBody>
                        </Card>
                    </form>
                </Col>
            </Row>
        </>
    );
}