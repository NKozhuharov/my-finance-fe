import React, {useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import "datatables.net-rowgroup-bs5";
import Modal from "react-bootstrap/Modal";
import CategoryNameAndIcon from "@components/categories/category-name-and-icon/CategoryNameAndIcon.jsx";


export default function CategorySelector({
                                             type,
                                             onlyParents,
                                             withChildren,
                                             onCategorySelect,
                                             defaultTitle = 'Select Category',
                                             disabled = false,
                                             preSelectedCategory // New prop to accept a pre-selected category
                                         }) {
    const [categories, setCategories] = useState([]);
    const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(preSelectedCategory || {
        name: defaultTitle,
        icon: `/images/icons/Category Select.png`,
    });

    const api = useApiClient();

    useEffect(() => {
        const fetchCategories = async () => {
            let endpoint = `/categories?limit=all&orderby=name&sort=asc`;
            if (type) {
                endpoint += `&filters[type]=${type}`;
            }
            if (onlyParents) {
                endpoint += `&filters[parent_category_id][is]=null`;
            }
            if (withChildren) {
                endpoint += `&resolve[]=children`;
            }

            try {
                const response = await api.get(endpoint);

                const categoryArray = [];
                (response.data.data || []).forEach((category) => {
                    categoryArray.push(category);
                    if (category.children?.data) {
                        category.children.data.forEach((childCategory) => {
                            categoryArray.push(childCategory);
                        });
                    }
                });

                categoryArray.sort((a, b) => a.type.localeCompare(b.type, undefined, {sensitivity: 'base'}));
                setCategories(categoryArray);
            } catch (err) {
                console.error("Error fetching category data: ", err);
            }
        };

        fetchCategories();
    }, [api, type, onlyParents, withChildren]);

    const handleCloseModal = () => setShowCategorySelectModal(false);
    const handleOpenModal = () => {
        if (disabled) {
            return;
        }
        setShowCategorySelectModal(true);
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category); // Update selected category state
        if (onCategorySelect) {
            onCategorySelect(category); // Notify parent about the selection
        }
        setShowCategorySelectModal(false);
    }

    return (
        <>
            <div className="d-flex align-items-center cursor-pointer" title="Select Category" onClick={handleOpenModal}>
                <CategoryNameAndIcon {...selectedCategory}/>
            </div>
            <Modal show={showCategorySelectModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        {categories.some(category => category.type === 'Expense') && (
                            <>
                                <div className="col-12">
                                    <h4 className="expense-color">Expense</h4>
                                </div>
                                <hr/>
                            </>
                        )}
                        {categories.filter(category => category.type === 'Expense').map((category) => (
                            <div className="col-12 pb-1 mb-2 border-bottom" key={category.id}>
                                <div className="d-flex align-items-center cursor-pointer" title={`Select ${category.name}`} onClick={() => handleCategorySelect(category)}>
                                    {category.parent_category_id &&
                                        <i className="bi bi-arrow-return-right ps-3 pe-2 fw-bold"></i>
                                    }
                                    <CategoryNameAndIcon {...category} />
                                    {selectedCategory.id === category.id && <i className="bi bi-check ps-2 pe-2 fw-bold ms-auto text-success" style={{fontSize: '1.5rem'}}></i>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        {categories.some(category => category.type === 'Income') && (
                            <>
                                <div className="col-12">
                                    <h4 className="income-color">Income</h4>
                                </div>
                                <hr/>
                            </>
                        )}
                        {categories.filter(category => category.type === 'Income').map((category) => (
                            <div className="col-12 pb-1 mb-2 border-bottom" key={category.id}>
                                <div className="d-flex align-items-center cursor-pointer" title={`Select ${category.name}`} onClick={() => handleCategorySelect(category)}>
                                    {category.parent_category_id &&
                                        <i className="bi bi-arrow-return-right ps-3 pe-2 fw-bold"></i>
                                    }
                                    <CategoryNameAndIcon {...category} />
                                    {selectedCategory.id === category.id && <i className="bi bi-check ps-2 pe-2 fw-bold ms-auto text-success" style={{fontSize: '1.5rem'}}></i>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal></>
    );
}
