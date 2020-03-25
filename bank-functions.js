/**
 * @return {number}
 * fv_rate (required argument) = This is the interest rate for each period.
 * fv_periods (required argument) = The total number of payment periods.
 * fv_payments (optional argument) = This specifies the payment per period. If we omit this argument, we need to provide the fv_present_value argument.
 * fv_present_value (optional argument) = This specifies the present value (fv_present_value) of the investment/loan.
 * The fv_present_value argument, if omitted, defaults to zero. If we omit the argument, we need to provide the Pmt argument.
 *
 * fv_type (optional argument) = This defines whether payments are made at start or end of the year.
 * The argument can either be 0 (payment is made at the end of the period) or 1 (the payment is made at the start of the period).
 */
function FV(fv_rate, fv_periods, fv_payments, fv_present_value, fv_type) {
    fv_present_value = fv_present_value || 0;
    fv_type = fv_type || 0;
    let result;

    if (fv_rate === 0) result = fv_present_value + fv_payments * fv_periods;

    else {
        let term = Math.pow(1 + fv_rate, fv_periods);

        result = 1 === fv_type ? fv_present_value * term + fv_payments * (1 + fv_rate) * (term - 1) / fv_rate :
            fv_present_value * term + fv_payments * (term - 1) / fv_rate
    }
    return result
}

/**
 * @return {number}
 * pv_rate (required argument) = The interest rate per compounding period.
 * A loan with a 12% annual interest rate and monthly required payments would have a monthly interest rate of 12%/12 or 1%.
 * Therefore, the pv_rate would be 1% .
 *
 * pv_periods  (required argument) = The number of payment periods.
 * For example, a 3 year loan with monthly payments would have 36 periods.
 * Therefore, pv_periods would be 36 months.
 *
 * pv_payment (required argument) = The fixed payment per period.
 * pv_future (optional argument) = An investment’s future value at the end of all payment periods (pv_periods).
 * If there is no input for pv_future, Excel will assume the input is 0.
 *
 * fv_type (optional argument) = Type indicates when payments are issued. There are only two inputs, 0 and 1.
 * If fv_type is omitted or 0 is the input, payments are made at period end. If set to 1, payments are made at period beginning.
 */
function PV(pv_rate, pv_periods, pv_payment, pv_future, fv_type) {
    pv_future = pv_future || 0;
    fv_type = fv_type || 0;

    if (pv_rate === 0) {
        return -pv_payment * pv_periods - pv_future;
    } else {
        return ((((1 - Math.pow(1 + pv_rate, pv_periods)) / pv_rate) * pv_payment * (1 + pv_rate * fv_type) - pv_future) /
            Math.pow(1 + pv_rate, pv_periods) * -1);
    }
}

/**
 * @return {number}
 * ipmt_rate (required argument) = This is the interest per period.
 * ipmt_period (required argument) = This is the period for which we want to find the interest and must be in the range from 1 to ipmt_periods.
 * ipmt_periods (required argument) = The total number of payment periods.
 * ipmt_present (required argument) = This is the present value, or the lump sum amount, that a series of future payments is worth as of now.
 * ipmt_future (optional argument) = The future value or a cash balance that we wish to attain after the last payment is made.
 * If we omit the ipmt_future argument, the function assumes it to be zero. The future value of a loan would be taken as zero.
 *
 * ipmt_type (optional argument) = Accepts the numbers 0 or 1 and indicates when payments are due.
 * If omitted, it is assumed to be 0. Set ipmt_type to 0 if payments are at the end of the period, and to 1 if payments are due at the start.
 */
function IPMT(ipmt_rate, ipmt_period, ipmt_periods, ipmt_present, ipmt_future, ipmt_type) {
    ipmt_future = ipmt_future || 0;
    ipmt_type = ipmt_type || 0;

    let impt_payment = PMT(ipmt_rate, ipmt_periods, ipmt_present, ipmt_future, ipmt_type);
    let impt_interest;
    if (ipmt_period === 1) {
        if (ipmt_type === 1) {
            impt_interest = 0;
        } else {
            impt_interest = -ipmt_present;
        }
    } else {
        if (ipmt_type === 1) {
            impt_interest = FV(ipmt_rate, ipmt_period - 2, impt_payment, ipmt_present, 1) - impt_payment;
        } else {
            impt_interest = FV(ipmt_rate, ipmt_period - 1, impt_payment, ipmt_present, 0);
        }
    }

    return impt_interest * ipmt_rate;
}

/**
 * @return {number}
 * pmt_rate (required argument) = The interest rate of the loan.
 * pmt_periods (required argument) = Total number of payments for the loan taken.
 * pmt_present (required argument) =  The present value or total amount that a series of future payments is worth now.
 * It is also termed as the principal of a loan.
 *
 * pmt_future (optional argument) = This is the future value or a cash balance we want to attain after the last payment is made.
 * If pmt_future is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.
 *
 * pmt_type (optional argument) = The type of day count basis to use. [basis - 0-4]
 */
function PMT(pmt_rate, pmt_periods, pmt_present, pmt_future, pmt_type) {
    pmt_future = pmt_future || 0;
    pmt_type = pmt_type || 0;

    let pmt_result;
    if (pmt_rate === 0) {
        pmt_result = (pmt_present + pmt_future) / pmt_periods;
    } else {
        let pmt_term = Math.pow(1 + pmt_rate, pmt_periods);
        if (pmt_type === 1) {
            pmt_result = (pmt_future * pmt_rate / (pmt_term - 1) + pmt_present * pmt_rate / (1 - 1 / pmt_term)) / (1 + pmt_rate);
        } else {
            pmt_result = pmt_future * pmt_rate / (pmt_term - 1) + pmt_present * pmt_rate / (1 - 1 / pmt_term);
        }
    }

    return pmt_result;
}

/**
 * @return {number}
 * ppmt_rate (required argument) = This is the interest rate per period.
 * ppmt_period (required argument) = A bond’s maturity date, that is, the date when bond expires.
 * ppmt_periods (required argument) = The total number of payment periods.
 * ppmt_present (required argument) = This is the present value of the loan/investment.
 * It is the total amount that a series of future payments is worth now.
 *
 * ppmt_future (optional argument) = Specifies the future value of the loan/investment at the end of pmt_present payments.
 * If omitted, [ppmt_future] takes on the default value of 0.
 *
 * ppmt_type (optional argument) = This specifies whether the payment is made at the start or the end of the period.
 * It can assume a value of 0 or 1. If it is 0, it means the payment is made at the end of the period, and if 1, the payment is made at the start.
 * If we omit the [ppmt_type] argument, it will take on the default value of 0, denoting payments made at the end of the period.
 */
function PPMT(ppmt_rate, ppmt_period, ppmt_periods, ppmt_present, ppmt_future, ppmt_type) {
    ppmt_future = ppmt_future || 0;
    ppmt_type = ppmt_type || 0;

    return PMT(ppmt_rate, ppmt_periods, ppmt_present, ppmt_future, ppmt_type) - IPMT(ppmt_rate, ppmt_period, ppmt_periods, ppmt_present, ppmt_future, ppmt_type);
}
