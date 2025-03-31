import {getIncomeExpenseColorClassFromAmount} from "@utils/helpers.js";

export default function TransactionAmountCell({amount, formattedAmount}) {
    return (
        <span className={`fw-bold float-end ${getIncomeExpenseColorClassFromAmount(amount)}`}>{formattedAmount}</span>
    );
};
