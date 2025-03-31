import {getIncomeExpenseColorClassFromAmount} from "../../../utils/helpers.js";

export default function TransactionAmountCell({amount, formattedtAmount}) {
    return (
        <span className={`fw-bold float-end ${getIncomeExpenseColorClassFromAmount(amount)}`}>{formattedtAmount}</span>
    );
};
