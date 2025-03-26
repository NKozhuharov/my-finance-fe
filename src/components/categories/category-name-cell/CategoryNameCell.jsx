export default function CategoryNameCell({name, icon, type, parent_category_id}) {
    return (
        <div className="d-flex align-items-center">
            {parent_category_id && <i className={`bi bi-arrow-return-right ps-2 pe-2 fw-bold ${type === 'Expense' ? 'expense-color' : 'income-color'}`}></i>}
            <div className="icon-container">
                <img
                    className="category-icon"
                    src={`${import.meta.env.VITE_ICONS_BASE_URL}${icon}`}
                    alt="No Icon"
                />
            </div>
            <span className={`fw-bold ms-2 ${type === 'Expense' ? 'expense-color' : 'income-color'}`}>{name}</span>
        </div>
    );
};
