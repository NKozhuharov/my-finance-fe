import React, {useActionState, useContext, useEffect, useState} from "react";
import {useApiClient} from "@hooks/useApiClient.js";
import {Link, useNavigate} from "react-router";
import {useCurrencies} from "@api/CurrenciesApi.js";
import {useWalletIcons} from "@api/IconsApi.js";
import {useAlert} from "@contexts/AlertContext.jsx";
import Select from "react-select";
import {CustomSingleValue, IconOption} from "@utils/IconComponents.jsx";
import {UserContext} from "@contexts/UserContext.jsx";
import CategoryNameAndIcon from "@components/categories/category-name-and-icon/CategoryNameAndIcon.jsx";
import {Button, Card, CardBody, CardHeader, Col, Form, FormCheck, Row} from "react-bootstrap";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";

export default function WalletCreate() {
    //@TODO - know issues - select/deselect all not implemented
    //@TODO - know issues - when form is submitted and there are errors, the checkbox 'checked' is not working correctly
    const [wallet, setWallet] = useState({
        name: '',
        currency_id: '',
        icon: '',
        income_categories: [],
        expense_categories: [],
    });
    const [loading, setLoading] = useState(true);
    const [defaultWalletCategories, setDefaultWalletCategories] = useState([]);
    const {currencies} = useCurrencies();
    const {walletIcons} = useWalletIcons();

    const [formErrors, setFormErrors] = useState({});

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    const {user, userDataChangeHandler} = useContext(UserContext);

    useEffect(() => {
        const fetchDefaultCategories = async () => {
            try {
                const response = await api.get(`/wallets/default-categories`);
                let responseData = response.data.data || [];

                responseData = responseData.map((item) => ({
                    ...item,
                    categoryKey: crypto.randomUUID()
                }));
                setDefaultWalletCategories(responseData);
            } catch (err) {
                console.error("Error fetching wallet default categories data: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDefaultCategories();
        document.title = "Create Wallet";
    }, [api]);

    const walletCreateHandler = async () => {
        setFormErrors({});
        const values = {...wallet}; // Create a shallow copy to avoid mutating state
        values.categories = [
            ...values.income_categories.map(categoryKey =>
                defaultWalletCategories.find(item => item.categoryKey === categoryKey)
            ).filter(item => item !== undefined),
            ...values.expense_categories.map(categoryKey =>
                defaultWalletCategories.find(item => item.categoryKey === categoryKey)
            ).filter(item => item !== undefined)
        ];
        delete values.income_categories;
        delete values.expense_categories;

        try {
            const response = await api.post(`/wallets`, values);
            if (!user.active_wallet_id) {
                const activeWallet = response.data.data;
                userDataChangeHandler({active_wallet_id: activeWallet.id, active_wallet: activeWallet});
            }
            setAlert({variant: "success", text: "Wallet created successfully."});
            navigate(`/wallets`);
        } catch (err) {
            setFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, submitAction, isPending] = useActionState(walletCreateHandler, {...wallet});

    return (
        <>
            <Row>
                <Col>
                    <form action={submitAction}>
                        <Card className="card-primary">
                            <CardHeader>
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to="/wallets" title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Create Wallet
                                <div className="card-tools">
                                    <Button className="btn btn-tool fw-bold" type="submit" title="Save" disabled={isPending || loading}>SAVE</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="name" className="fw-bold" column={true}>Name</Form.Label>
                                        <Form.Control
                                            name="name"
                                            value={wallet.name}
                                            onChange={(e) => setWallet((currentWallet) => ({...currentWallet, name: e.target.value}))}
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
                                        <Form.Label htmlFor="currency_id" className="fw-bold" column={true}>Currency</Form.Label>
                                        <Select
                                            name="currency_id"
                                            options={currencies}
                                            value={currencies.find(option => option.value === wallet.currency_id) || null}
                                            onChange={(selectedOption) => setWallet((currentWallet) => ({...currentWallet, currency_id: selectedOption.value}))}
                                            className={formErrors.currency_id ? 'is-invalid' : ''}
                                            isSearchable={true}
                                            placeholder="Please select"
                                            required
                                        />
                                        {formErrors.currency_id &&
                                            <Form.Control.Feedback type="invalid">
                                                <strong>{formErrors.currency_id}</strong>
                                            </Form.Control.Feedback>
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="icon" className="fw-bold" column={true}>Icon</Form.Label>
                                        <Select
                                            name="icon"
                                            options={walletIcons}
                                            value={walletIcons.find(option => option.value === wallet.icon) || null}
                                            onChange={(selectedOption) => setWallet((currentWallet) => ({...currentWallet, icon: selectedOption.value}))}
                                            className={formErrors.icon ? 'is-invalid' : ''}
                                            isSearchable={true}
                                            placeholder="Please select"
                                            components={{Option: IconOption, SingleValue: CustomSingleValue}}
                                            required
                                        />
                                        {formErrors.icon &&
                                            <Form.Control.Feedback type="invalid">
                                                <strong>{formErrors.icon}</strong>
                                            </Form.Control.Feedback>
                                        }
                                    </Col>
                                </Row>
                                <hr/>
                                {formErrors.categories &&
                                    <Row className="mb-2">
                                        <Col className="text-center">
                                            <span className="text-danger mt-2">
                                                <strong>{formErrors.categories}</strong>
                                            </span>
                                        </Col>
                                    </Row>
                                }
                                <Row>
                                    <Col lg={6} sm={12}>
                                        <Card className="card-secondary">
                                            <CardHeader className="income-background-color">
                                                Select Income Categories
                                                <div className="float-end">
                                                    <FormCheckInput id="select-all-income" title="Select all"/>
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                {loading ? (
                                                    <Form.Text>Loading income categories...</Form.Text>
                                                ) : (
                                                    defaultWalletCategories
                                                        .filter(category => category.type === 'Income')
                                                        .map((category) => (
                                                            <FormCheck key={category.categoryKey}>
                                                                <FormCheckInput
                                                                    name={`categories[${category.categoryKey}]`}
                                                                    checked={wallet.income_categories.includes(category.categoryKey)}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.target.checked;
                                                                        setWallet((prevWallet) => ({
                                                                            ...prevWallet,
                                                                            income_categories: isChecked
                                                                                ? [...prevWallet.income_categories, category.categoryKey]
                                                                                : prevWallet.income_categories.filter((cat) => cat !== category.categoryKey),
                                                                        }));
                                                                    }}
                                                                />
                                                                <FormCheckLabel htmlFor={`category-${category.name}`}>
                                                                    <div className="d-flex align-items-center">
                                                                        <CategoryNameAndIcon {...category}/>
                                                                    </div>
                                                                </FormCheckLabel>
                                                            </FormCheck>
                                                        ))
                                                )}
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg={6} sm={12}>
                                        <Card className="card-secondary">
                                            <CardHeader className="expense-background-color">
                                                Select Expense Categories
                                                <div className="float-end">
                                                    <FormCheckInput id="select-all-income" title="Select all"/>
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                {loading ? (
                                                    <Form.Text>Loading expense categories...</Form.Text>
                                                ) : (
                                                    defaultWalletCategories
                                                        .filter(category => category.type === 'Expense')
                                                        .map((category) => (
                                                            <FormCheck key={category.categoryKey}>
                                                                <FormCheckInput
                                                                    name={`categories[${category.categoryKey}]`}
                                                                    checked={wallet.expense_categories.includes(category.categoryKey)}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.target.checked;
                                                                        setWallet((prevWallet) => ({
                                                                            ...prevWallet,
                                                                            expense_categories: isChecked
                                                                                ? [...prevWallet.expense_categories, category.categoryKey]
                                                                                : prevWallet.expense_categories.filter((cat) => cat !== category.categoryKey),
                                                                        }));
                                                                    }}
                                                                />
                                                                <FormCheckLabel htmlFor={`category-${category.name}`}>
                                                                    <div className="d-flex align-items-center">
                                                                        <CategoryNameAndIcon {...category}/>
                                                                    </div>
                                                                </FormCheckLabel>
                                                            </FormCheck>
                                                        ))
                                                )}
                                            </CardBody>
                                        </Card>
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