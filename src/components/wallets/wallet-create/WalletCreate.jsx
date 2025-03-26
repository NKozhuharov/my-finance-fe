import React, {useActionState, useContext, useEffect, useState} from "react";
import AdminPanelPage from "../../../layouts/admin-panel-page/AdminPanelPage";
import {useApiClient} from "../../../hooks/useApiClient.js";
import {Link, useNavigate} from "react-router";
import {useCurrencies} from "../../../api/CurrenciesApi.js";
import {useWalletIcons} from "../../../api/IconsApi.js";
import {useAlert} from "../../../contexts/AlertContext.jsx";
import Select from "react-select";
import {CustomSingleValue, IconOption} from "../../../utils/IconComponents.jsx";
import CategoryIcon from "../../category-icon/CategoryIcon.jsx";
import {UserContext} from "../../../contexts/UserContext.jsx";

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
    const [defaultWalletCategories, setDefaultWalletCategories] = useState([]);
    const {currencies} = useCurrencies();
    const {walletIcons} = useWalletIcons();

    const [walletFormErrors, setWalletFormErrors] = useState({});

    const api = useApiClient();

    const navigate = useNavigate();

    const {setAlert} = useAlert();

    const {userDataChangeHandler} = useContext(UserContext);

    useEffect(() => {
        const fetchDefaultCategories = async () => {
            try {
                const response = await api.get(`/wallets/default-categories`);
                let responseData = response.data.data || [];

                responseData = responseData.map((item) => ({
                    ...item,
                    key: crypto.randomUUID()
                }));
                setDefaultWalletCategories(responseData);
            } catch (err) {
                console.error("Error fetching wallet default categories data: ", err);
            }
        };

        fetchDefaultCategories();
    }, [api]);

    const walletCreateHandler = async () => {
        setWalletFormErrors({});
        const values = {...wallet}; // Create a shallow copy to avoid mutating state
        values.categories = [
            ...values.income_categories.map(key =>
                defaultWalletCategories.find(item => item.key === key)
            ).filter(item => item !== undefined),
            ...values.expense_categories.map(key =>
                defaultWalletCategories.find(item => item.key === key)
            ).filter(item => item !== undefined)
        ];
        delete values.income_categories;
        delete values.expense_categories;

        try {
            const response = await api.post(`/wallets`, values);
            userDataChangeHandler({active_wallet_id: response.data.data.id});
            setAlert({variant: "success", text: "Wallet created successfully."});
            navigate(`/wallets`);
        } catch (err) {
            setWalletFormErrors(err.response.data.details);
            setAlert({variant: "danger", text: err.response.data.message});
        }
    }

    const [_, createAction, isPending] = useActionState(walletCreateHandler, {...wallet});

    return (
        <AdminPanelPage>
            <div className="row mb-3 pt-3">
                <div className="col-12">
                    <form action={createAction}>
                        <div className="card card-primary">
                            <div className="card-header">
                                <div className="card-tools-left">
                                    <Link className="btn btn-tool" to="/wallets" title="Back">
                                        <i className="bi bi-arrow-left"></i>
                                    </Link>
                                </div>
                                Create Wallet
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
                                            value={wallet.name}
                                            onChange={(e) => setWallet((currentWallet) => ({...currentWallet, name: e.target.value}))}
                                            className={`form-control${walletFormErrors.name ? ' is-invalid' : ''}`}
                                            placeholder="Name"

                                        />
                                        {walletFormErrors.name &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{walletFormErrors.name}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="currency_id" className="form-label fw-bold">Currency</label>
                                        <Select
                                            name="currency_id"
                                            options={currencies}
                                            value={currencies.find(option => option.value === wallet.currency_id) || null}
                                            onChange={(selectedOption) => setWallet((currentWallet) => ({...currentWallet, currency_id: selectedOption.value}))}
                                            className={`${walletFormErrors.currency_id ? ' is-invalid' : ''}`}
                                            isSearchable={true}
                                            placeholder="Please select"

                                        />
                                        {walletFormErrors.currency_id &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{walletFormErrors.currency_id}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-12">
                                        <label htmlFor="currency_id" className="form-label fw-bold">Icon</label>
                                        <Select
                                            name="icon"
                                            options={walletIcons}
                                            value={walletIcons.find(option => option.value === wallet.icon) || null}
                                            onChange={(selectedOption) => setWallet((currentWallet) => ({...currentWallet, icon: selectedOption.value}))}
                                            className={`${walletFormErrors.currency_id ? ' is-invalid' : ''}`}
                                            isSearchable={true}
                                            placeholder="Please select"
                                            components={{Option: IconOption, SingleValue: CustomSingleValue}}

                                        />
                                        {walletFormErrors.icon &&
                                            <span className="invalid-feedback" role="alert">
                                                <strong>{walletFormErrors.icon}</strong>
                                            </span>
                                        }
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-lg-6 col-sm-12">
                                        <div className="card card-secondary">
                                            <div className="card-header income-background-color">
                                                Income Categories
                                                <div className="float-end">
                                                    <input type="checkbox" className="form-check-input" id="select-all-income" title="Select all"/>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                {defaultWalletCategories
                                                    .filter(category => category.type === 'Income')
                                                    .map((category) => (
                                                        <div className="form-check" key={category.key}>
                                                            <input
                                                                className="form-check-input income-category-checkbox"
                                                                type="checkbox"
                                                                name={`categories[${category.key}]`}
                                                                checked={wallet.income_categories.includes(category.key)}
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    setWallet((prevWallet) => ({
                                                                        ...prevWallet,
                                                                        income_categories: isChecked
                                                                            ? [...prevWallet.income_categories, category.key]
                                                                            : prevWallet.income_categories.filter((cat) => cat !== category.key),
                                                                    }));
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor={`category-${category.name}`}>
                                                                <CategoryIcon category={category}/>
                                                            </label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        {walletFormErrors.categories &&
                                            <span className="text-danger" role="alert">
                                                <strong>{walletFormErrors.categories}</strong>
                                            </span>
                                        }
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                        <div className="card card-secondary">
                                            <div className="card-header expense-background-color">
                                                Expense Categories
                                                <div className="float-end">
                                                    <input type="checkbox" className="form-check-input" id="select-all-income" title="Select all"/>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                {defaultWalletCategories
                                                    .filter(category => category.type === 'Expense')
                                                    .map((category) => (
                                                        <div className="form-check" key={category.key}>
                                                            <input
                                                                className="form-check-input income-category-checkbox"
                                                                type="checkbox"
                                                                name={`categories[${category.key}]`}
                                                                checked={wallet.expense_categories.includes(category.key)}
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    setWallet((prevWallet) => ({
                                                                        ...prevWallet,
                                                                        expense_categories: isChecked
                                                                            ? [...prevWallet.expense_categories, category.key]
                                                                            : prevWallet.expense_categories.filter((cat) => cat !== category.key),
                                                                    }));
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor={`category-${category.name}`}>
                                                                <CategoryIcon category={category}/>
                                                            </label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
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