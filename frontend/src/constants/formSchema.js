import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import moment from "moment";
import {DATE_FORMAT, FORM_ERROR_MESSAGES} from "./constants";

/* eslint-disable no-template-curly-in-string */
yup.setLocale({
    mixed:{
        required: "Campo obrigatório",
    },
    number:{
        min: 'Deve ser maior que ${min}',
    },
    string:{
        min: "Campo deve possuir no minimo ${min} caracter(es)",
        length: "Este campo deve possuir ${length} caracter(es)",
        max: "Este campo deve possuir no máximo ${max} caracter(es)",
    }
});

export const transferForm = (minDate) => yupResolver(
    yup.object().shape(
    {
        originAccountType: yup.number().required().integer().isSelected().positive(),
        userName: yup.string().required().min(4),
        numDestinationAccount: yup.string().required().length(4),
        destinationAccountType: yup.number().required().integer().isSelected().positive(),
        favoredName: yup.string().required().min(4),
        personType: yup.number().required().integer().isSelected().positive(),
        destinationPersonType: yup.string().required().min(11).max(12),
        transferValue: yup.number().typeError(FORM_ERROR_MESSAGES.strToNumberError).required().moreThan(0),
        transferDescription: yup.string().optionalStr(4),
        transferDate: yup.string().required().isDateValid().minDate(minDate),
    })
);

yup.addMethod(yup.string, "optionalStr", function(minLength)
{
    return this.test("optionalStr", FORM_ERROR_MESSAGES.minLength, (value) => 
    {
        return value.trim().length === 0 ? true : value.trim().length >= minLength;
    })
});

yup.addMethod(yup.string, "isDateValid", function()
{
    return this.test("isDateValid", FORM_ERROR_MESSAGES.invalidDate, (value) => 
    {
        return moment(value, DATE_FORMAT, true).isValid();
    })
});

yup.addMethod(yup.string, "minDate", function(minDate)
{
    return this.test("minDate", FORM_ERROR_MESSAGES.minDate, (value) => 
    {
        return moment(value, DATE_FORMAT, true).diff(minDate, "days") >= 0;
    })
});

yup.addMethod(yup.string, "maxDate", function(maxDate)
{
    return this.test("maxDate", FORM_ERROR_MESSAGES.maxDate, (value) => 
    {
        return this.isDateValid() && moment(maxDate, DATE_FORMAT, true).diff(moment(value, DATE_FORMAT, true), "days") >= 0;
    })
});

yup.addMethod(yup.number, "isSelected", function()
{
    return this.test("isSelected", FORM_ERROR_MESSAGES.select, (value) => 
    {
        return value > 0;
    })
});