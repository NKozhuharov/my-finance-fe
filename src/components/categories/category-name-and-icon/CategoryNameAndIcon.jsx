import {getIncomeExpenseColorClassFromType} from "@utils/helpers.js";

export default function CategoryNameAndIcon({name, icon, type, wallet}) {
    return (
        <>
            <div className="icon-container">
                <img
                    className="category-icon"
                    src={`${import.meta.env.VITE_ICONS_BASE_URL}${icon}`}
                    alt="No Icon"
                />
            </div>
            <div className="ms-2">
                <span className={`fw-bold ${getIncomeExpenseColorClassFromType(type)}`}>{name}</span>
                {wallet && (
                    <p className="category-wallet">{wallet.data.name}</p>
                )}
            </div>
        </>
    );
};
