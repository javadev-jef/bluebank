import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import DatePicker from "../../../components/DatePicker";
import Select from "../../../components/Select";
import { statementForm } from "../../../constants/formSchema";
import { getFinalDateOfMonth, getInitialDateOfMonth } from "../../../utils/functionUtils";

const Form = ({onSuccess = () => {}, onError = () => {}, loading, serverComponents, fieldErrors, onChangeAccount = () =>{}}) =>
{
    const [initialDateTemp, setInitialDateTemp] = useState(getInitialDateOfMonth());
    const [finalDateTemp, setFinalDateTemp] = useState(getFinalDateOfMonth());

    const {accountTypes, userAccounts} = serverComponents;
    
    const {register, handleSubmit, errors, setError, clearErrors, getValues} = useForm(
    {
        resolver: statementForm(initialDateTemp, finalDateTemp), 
        reValidateMode: "onSubmit",
    });

    const onAccountSelected = useCallback((accountType) =>
    {
        onChangeAccount(userAccounts[accountType]);
    }, 
    [userAccounts, onChangeAccount]);

    // SET NUM-ACCOUNT ON LOAD ACCOUNT-TYPES
    useEffect(()=>
    {
        if(accountTypes)
        {
            onAccountSelected(getValues("accountType"));
        }
    },
    [accountTypes, getValues, onAccountSelected]);

    // SET MANUAL ERRORS TO REACT-HOOK-FORM
    useEffect(()=>
    {
        for(const error in fieldErrors)
        {
            setError(error, {message: fieldErrors[error]});
        }
    }, 
    [fieldErrors, setError]);

    useEffect(()=>
    {
        onError(errors);
    }, 
    [errors, onError]);

    // FETCH STATEMENTS ONLOAD
    useEffect(()=>
    {
        if(accountTypes)
        {
            handleSubmit(onSuccess)();
        }
    },
    [handleSubmit, onSuccess, accountTypes]);

    return(
        <fieldset>
            <legend>Dados de Busca</legend>
            <form action="GET" onSubmit={handleSubmit(onSuccess)} autoComplete={"off"}>
                <div style={{display:'flex'}}>
                    <Select 
                        name="accountType"
                        data={accountTypes}
                        refForm={register}
                        valueName="type"
                        labelName="displayName"
                        title={errors.accountType?.message}
                        className={errors.accountType && "input-error"}
                        onChange={e => onAccountSelected(e.target.value)}
                        style={{minWidth: 180, maxWidth: 180}}
                    />

                    <DatePicker 
                        placeholder="Data Inicial"
                        refForm={register}
                        name="initialDate"
                        value={initialDateTemp}
                        onChange={setInitialDateTemp}
                        title={errors.initialDate?.message}
                        className={errors.initialDate && "input-error"}
                        style={{maxWidth: 186}}
                    />

                    <DatePicker 
                        placeholder="Data Final"
                        refForm={register}
                        name="finalDate"
                        value={finalDateTemp}
                        onChange={setFinalDateTemp}
                        title={errors.finalDate?.message}
                        className={errors.finalDate && "input-error"}
                        style={{maxWidth: 186}}
                    />

                    <Button 
                        value="Buscar"
                        loading={loading}
                        onClick={() => clearErrors()}
                        style={{width: 120}}
                    />
                </div>
            </form>
        </fieldset>
    );
}

export default Form;