import React, {useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import "datatables.net-rowgroup-bs5";
import Modal from "react-bootstrap/Modal";
import CategoryNameAndIcon from "@components/categories/category-name-and-icon/CategoryNameAndIcon.jsx";
import {Col, FormControl, Row, ToggleButton} from "react-bootstrap";

export default function CategorySelector({
                                             type,
                                             onlyParents,
                                             withChildren,
                                             onCategorySelect,
                                             defaultTitle = 'Select Category',
                                             disabled = false,
                                             preSelectedCategory
                                         }) {
    if (preSelectedCategory === undefined || Object.keys(preSelectedCategory).length === 0) {
        preSelectedCategory = {
            name: defaultTitle,
            icon: `/images/icons/Category Select.png`,
        };
    }

    const [categories, setCategories] = useState([]);
    const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(preSelectedCategory);
    const [searching, setSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

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

    const handleCloseModal = () => {
        setShowCategorySelectModal(false);
        toggleSearch(false);
    }
    const handleOpenModal = () => {
        if (disabled) {
            return;
        }
        setShowCategorySelectModal(true);
    }

    const toggleSearch = (value) => {
        setSearching(value);
        if (!value) {
            setSearchText('');
        }
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
            <div
                className={`d-flex align-items-center category-select-button${disabled ? ' disabled' : ''}`}
                title={`${disabled ? ' Select Category Type before selecting a Parent Category' : 'Select Parent Category'}`}
                onClick={handleOpenModal}
            >
                <CategoryNameAndIcon {...selectedCategory}/>
            </div>
            <Modal show={showCategorySelectModal} onHide={handleCloseModal} fullscreen={"sm-down"}>
                <Modal.Header>
                    <a className="btn btn-tool" onClick={handleCloseModal}>
                        <i className="bi bi-arrow-left"></i>
                    </a>
                    <Modal.Title>Select Category</Modal.Title>

                    <ToggleButton
                        id="toggle-search"
                        type="checkbox"
                        className="btn btn-tool ms-auto"
                        variant="outline-secondary"
                        checked={searching}
                        value="1"
                        onChange={(e) => toggleSearch(e.currentTarget.checked)}
                    >
                        <i className="bi bi-search"></i>
                    </ToggleButton>
                </Modal.Header>
                <Modal.Body>
                    {searching && (
                        <Row>
                            <Col className="mb-2">
                                <FormControl
                                    placeholder="Search..."
                                    name="search-text"
                                    onChange={(e) => setSearchText(e.target.value)}
                                    value={searchText}
                                />
                            </Col>
                        </Row>
                    )}
                    {categories.filter(category => category.name.toLowerCase().includes(searchText.toLowerCase())).some(category => category.type === 'Expense') && (
                        <Row>
                            <Col>
                                <h4 className="expense-color">Expense</h4>
                            </Col>
                            <hr/>
                        </Row>
                    )}
                    {categories.filter(category => category.type === 'Expense' && category.name.toLowerCase().includes(searchText.toLowerCase())).map((category) => (
                        <Row key={category.id}>
                            <Col className="pb-1 mb-2 border-bottom">
                                <div className="d-flex align-items-center cursor-pointer" title={`Select ${category.name}`} onClick={() => handleCategorySelect(category)}>
                                    {category.parent_category_id &&
                                        <i className="bi bi-arrow-return-right ps-3 pe-2 fw-bold"></i>
                                    }
                                    <CategoryNameAndIcon {...category} />
                                    {selectedCategory.id === category.id && <i className="bi bi-check ps-2 pe-2 fw-bold ms-auto text-success" style={{fontSize: '1.5rem'}}></i>}
                                </div>
                            </Col>
                        </Row>
                    ))}
                    {categories.filter(category => category.name.toLowerCase().includes(searchText.toLowerCase())).some(category => category.type === 'Income') && (
                        <Row>
                            <Col>
                                <h4 className="income-color">Income</h4>
                            </Col>
                            <hr/>
                        </Row>
                    )}
                    {categories.filter(category => category.type === 'Income' && category.name.toLowerCase().includes(searchText.toLowerCase())).map((category) => (
                        <Row key={category.id}>
                            <Col className="pb-1 mb-2 border-bottom">
                                <div className="d-flex align-items-center cursor-pointer" title={`Select ${category.name}`} onClick={() => handleCategorySelect(category)}>
                                    {category.parent_category_id &&
                                        <i className="bi bi-arrow-return-right ps-3 pe-2 fw-bold"></i>
                                    }
                                    <CategoryNameAndIcon {...category} />
                                    {selectedCategory.id === category.id && <i className="bi bi-check ps-2 pe-2 fw-bold ms-auto text-success" style={{fontSize: '1.5rem'}}></i>}
                                </div>
                            </Col>
                        </Row>
                    ))}
                </Modal.Body>
            </Modal>
        </>
    );
}
