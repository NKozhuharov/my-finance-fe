import {getIncomeExpenseColorClassFromType} from "@utils/helpers.js";
import CategoryNameAndIcon from "@components/categories/category-name-and-icon/CategoryNameAndIcon.jsx";

export default function CategoryNameCell({name, icon, type, parent_category_id}) {
    return (
        <div className="d-flex align-items-center">
            {parent_category_id && <i className={`bi bi-arrow-return-right ps-2 pe-2 fw-bold ${getIncomeExpenseColorClassFromType(type)}`}></i>}
            <CategoryNameAndIcon name={name} icon={icon} type={type}/>
        </div>
    );
};
