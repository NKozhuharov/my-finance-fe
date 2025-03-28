export const addBodyClass = (classList) => {
    document.body.classList.add(classList);
};

export function removeBodyClass(className) {
    document.body.classList.remove(className);
}

export function getIncomeExpenseColorClass(value) {
    if (value === undefined) {
        return '';
    }
    switch (value.toLowerCase()) {
        case 'income':
            return "income-color";
        case 'expense':
            return "expense-color";
        default:
            return '';
    }
}