import {getIncomeExpenseColorClassFromType} from "../../../utils/helpers.js";

export default function CategoryNameAndIcon({name, icon, type}) {
    return (
        <>
            <div className="icon-container">
                <img
                    className="category-icon"
                    src={`${import.meta.env.VITE_ICONS_BASE_URL}${icon}`}
                    alt="No Icon"
                />
            </div>
            <span className={`fw-bold ms-2 ${getIncomeExpenseColorClassFromType(type)}`}>{name}</span>
        </>
    );
};
