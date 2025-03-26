export default function WalletNameCell({name, icon}) {
    return (
        <div className="d-flex align-items-center">
            <div className="icon-container">
                <img className="category-icon" src={`${import.meta.env.VITE_ICONS_BASE_URL}${icon}`} alt="No Icon"/>
            </div>
            <span className="fw-bold ms-2">{name}</span>
        </div>
    );
};
