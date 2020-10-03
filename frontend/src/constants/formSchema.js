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
        moreThan: "O valor informado deve ser maior que ${more}"
    },
    string:{
        min: "Campo deve possuir no minimo ${min} caracter(es)",
        length: "Este campo deve possuir ${length} caracter(es)",
        max: "Este campo deve possuir no máximo ${max} caracter(es)",
        email: "E-mail informado é inválido"
    }
});

export const registerForm = () =>  yupResolver(
    yup.object().shape(
    {
        name: yup.string().required().min(4),
        personType: yup.string().required(),
        cpfCnpj: yup.string().when("personType",{
            is: val => val === "CPF",
            then: yup.string().required().length(11),
            otherwise: yup.string().required().length(14)
        }),
        birthDate: yup.date().required().isDateValid(DATE_FORMAT).isAgeOfMajority(),
        email: yup.string().required().email(),
        stateId: yup.number().required().integer().isSelected().positive(),
        cityId: yup.number().required().integer().isSelected().positive(),
        password: yup.string().optionalStr(6),
        passwordConfirm: yup.string().when("password", {
            is: val => val != null,
            then: yup.string().oneOf([yup.ref("password"), null], FORM_ERROR_MESSAGES.passwordConfirm)
        })
    })
);

export const withdrawForm = () =>  yupResolver(
    yup.object().shape(
    {
        accountType: yup.string().required(),
        userName: yup.string().required().min(4),
        cashType: yup.string().required(),
        amount: yup.number().typeError(FORM_ERROR_MESSAGES.strToNumberError).required().moreThan(9),
    })
);

export const depositForm = () =>  yupResolver(
    yup.object().shape(
    {
        numAccount: yup.string().required().min(5),
        accountType: yup.string().required(),
        userName: yup.string().required().min(4),
        depositorName: yup.string().required().min(6),
        cpfCnpj: yup.string().required().min(11).max(14),
        phone: yup.string().required().min(10).max(11),
        cashType: yup.string().required(),
        amount: yup.number().when("cashType",
        {
            is: "CASH", 
            then: yup.number().typeError(FORM_ERROR_MESSAGES.strToNumberError).required().moreThan(9)
        })
    })
);

export const statementForm = (initialDate, finalDate) =>  yupResolver(
    yup.object().shape(
    {
        accountType: yup.string().required(),
        initialDate: yup.date().required().isDateValid(DATE_FORMAT).validateInitialDate(finalDate),
        finalDate: yup.date().required().isDateValid(DATE_FORMAT).validateFinalDate(initialDate)
    })
);

export const transferForm = (minDate) => yupResolver(
    yup.object().shape(
    {
        userAccountType: yup.string().required(),
        userName: yup.string().required().min(4),
        numAccount: yup.string().required().min(5),
        accountType: yup.string().required(),
        favoredName: yup.string().required().min(4),
        personType: yup.string().required(),
        cpfCnpj: yup.string().required().min(11).max(14),
        amount: yup.number().typeError(FORM_ERROR_MESSAGES.strToNumberError).required().moreThan(9),
        description: yup.string().nullable(true).default(null).optionalStr(4),
        whenToDo: yup.date().required().isDateValid(DATE_FORMAT).minDate(minDate),
    })
);

yup.addMethod(yup.date, "isAgeOfMajority", function()
{
    return this.test("isAgeOfMajority", FORM_ERROR_MESSAGES.ageOfMajority, (value) => 
    {
        const maxDate = moment(new Date(), DATE_FORMAT, true).subtract(18, "years");
        //console.log(new Date(maxDate));
        return this.isDateValid() && moment(maxDate, DATE_FORMAT, true).diff(moment(value, DATE_FORMAT, true), "days", true) >= 0;
    })
});

yup.addMethod(yup.date, "validateFinalDate", function(initialDate)
{
    return this.test("validateFinalDate", FORM_ERROR_MESSAGES.invalidFinalDate, (value) => 
    {
        return moment(value, DATE_FORMAT, true).diff(initialDate, "days", true) >= 0;
    })
});

yup.addMethod(yup.date, "validateInitialDate", function(finalDate)
{
    return this.test("validateInitialDate", FORM_ERROR_MESSAGES.invalidInitialDate, (value) => 
    {
        return moment(value, DATE_FORMAT, true).diff(finalDate, "days", true) <= 0;
    })
});

yup.addMethod(yup.string, "optionalStr", function(minLength)
{
    return this.transform(function(value, originalValue)
    {
        return value.trim().length === 0 ? undefined : value;
    })
    .test("optionalStr", FORM_ERROR_MESSAGES.minLength, (value) => 
    {
        return value === undefined ? true : value.trim().length >= minLength;
    });
});

yup.addMethod(yup.string, "isDateValid", function()
{
    return this.test("isDateValid", FORM_ERROR_MESSAGES.invalidDate, (value) => 
    {
        return moment(value, DATE_FORMAT, true).isValid();
    })
});

yup.addMethod(yup.date, "isDateValid", function(format)
{
    return this.transform(function(value, originalValue)
    {
        value = moment(originalValue, format, true);

        return value.isValid() ? value.toDate() : null;
    });
});

yup.addMethod(yup.date, "minDate", function(minDate)
{
    return this.test("minDate", FORM_ERROR_MESSAGES.minDate, (value) => 
    {
        return moment(value, DATE_FORMAT, true).diff(minDate, "days") >= 0;
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
        return this.isDateValid() && moment(maxDate, DATE_FORMAT, true).diff(moment(value, DATE_FORMAT, true), "days", true) >= 0;
    })
});

yup.addMethod(yup.number, "isSelected", function()
{
    return this.test("isSelected", FORM_ERROR_MESSAGES.select, (value) => 
    {
        return value > 0;
    })
});