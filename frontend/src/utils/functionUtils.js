import moment from "moment";
import { DATE_FORMAT } from "../constants/constants";

export const formatCurrencyValue = (value) =>
{
    return Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(value);
}

export const getInitialDateOfMonth = () =>
{
    return moment().startOf('month');
}

export const getFinalDateOfMonth = () =>
{
    return moment().endOf('month');
}

export const getAgeOfMajority = (serverDate) =>
{
    return moment(serverDate, DATE_FORMAT, true).subtract(18, "years");
}