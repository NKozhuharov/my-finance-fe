export default function CategoryIcon({category, wallet}) {
    return (
        <div className="d-flex align-items-center">
            <div className="icon-container">
                <img className="category-icon"
                     src={category.icon ? `${import.meta.env.VITE_ICONS_BASE_URL}${category.icon}` : `${import.meta.env.VITE_ICONS_BASE_URL}/images/icons/Category Select.png`} alt="No Icon"/>
            </div>
            <div className="ms-2">
                {category?.type === "Income" ? (
                    <span className="fw-bold category-name income-color">{category.name}</span>
                ) : category?.type === "Expense" ? (
                    <span className="fw-bold category-name expense-color">{category.name}</span>
                ) : (
                    <span className="fw-bold category-name">Please Select</span>
                )}
                {wallet && (
                    <p className="small category-wallet">{wallet.name}</p>
                )}
            </div>
        </div>
    );
}