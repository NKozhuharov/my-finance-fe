export const addBodyClass = (classList) => {
    document.body.classList.add(classList);
};

export function removeBodyClass(className) {
    document.body.classList.remove(className);
}

export function getIncomeExpenseColorClassFromType(value) {
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

export function getIncomeExpenseColorClassFromAmount(amount) {
    if (amount === undefined) {
        return '';
    }

    if (amount >= 0) {
        return "income-color";
    }

    return "expense-color";
}