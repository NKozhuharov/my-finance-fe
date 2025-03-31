import React, {useActionState, useState} from "react";
import AdminPanelPage from "@layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate} from "react-router";
import Select from "react-select";
import {useAlert} from "@contexts/AlertContext.jsx";
import {useCategoryIcons} from "@api/IconsApi.js";
import {CustomSingleValue, IconOption} from "@utils/IconComponents.jsx";
import CategorySelector from "@components/categories/category-selector/CategorySelector.jsx";

export default function CategoryCreate() {
    const [category, setCategory] = useState({
        name: '',
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

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    const handleCategorySelect = (category) => {
        category.parentCategory = category;
    };

    const categoryEditHandler = async (_, formData) => {
        setFormErrors({});
        const values = Object.fromEntries(formData);

        try {
            await api.post(`/categories`, values, {});
            setAlert({variant: "success", text: "Category created successfully."});
            navigate(`/categories`);
        } catch (err) {
            setFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, editAction, isPending] = useActionState(categoryEditHandler, {...category});

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <form action={editAction}>
                        <div className="card card-primary">
                            <div className="card-header">
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to={`/categories`} title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Create Category
                                <div className="card-tools">
                                    <button className="btn btn-tool fw-bold" type="submit" title="Save" disabled={isPending}>SAVE</button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="name" className="form-label fw-bold">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={category.name}
                                            onChange={(e) => setCategory({...category, name: e.target.value})}
                                            className={`form-control${formErrors.name ? ' is-invalid' : ''}`}
                                            placeholder="Name"
                                            required
                                        />
                                        {formErrors.name &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{formErrors.name}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="type" className="form-label fw-bold">Type</label>
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
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{formErrors.type}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="parent_category_id" className="form-label fw-bold">Parent Category</label>
                                        <CategorySelector onlyParents={true} withChildren={false} onCategorySelect={handleCategorySelect} type={category.type} disabled={category.type === null}/>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="currency_id" className="form-label fw-bold">Icon</label>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPanelPage>
    );
}