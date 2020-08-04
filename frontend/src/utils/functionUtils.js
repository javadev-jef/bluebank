import moment from "moment";

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