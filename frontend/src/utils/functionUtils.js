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

export const getAgeOfMajority = (serverDate, personType = "CPF") =>
{
    const years = personType === "CNPJ" ? 1 : 18;
    return moment(serverDate, DATE_FORMAT, true).subtract(years, "years");
}

export const isFutureDate = (date) =>
{
    return moment(date, DATE_FORMAT, true).diff(moment(new Date(), DATE_FORMAT, true).add(1, "days"), "days") >= 0;
}

export const isEmptyString = (value) =>
{
    return value === null ? true : value.trim().length === 0;
}