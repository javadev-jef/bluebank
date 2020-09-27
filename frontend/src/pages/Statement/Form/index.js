import React, { useState, useEffect, useCallback } from "react";

import { Grid } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Select from "../../../components/Select"; 
import DatePicker from "../../../components/DatePicker";

import { getInitialDateOfMonth, getFinalDateOfMonth } from "../../../utils/functionUtils";
import { statementForm } from "../../../constants/formSchema";

const Form = ({onSuccess = () => {}, onError = () => {}, loading, serverComponents, onChangeAccount = () =>{}}) =>
{
    const [initialDateTemp, setInitialDateTemp] = useState(getInitialDateOfMonth());
    const [finalDateTemp, setFinalDateTemp] = useState(getFinalDateOfMonth());

    const {accountTypes, userAccounts} = serverComponents;
    
    const {register, handleSubmit, errors, clearErrors, getValues} = useForm(
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

    useEffect(()=>
    {
        onError(errors);
    }, 
    [errors, onError]);

    return(
        <fieldset>
            <legend>Dados de Busca</legend>
            <form action="GET" onSubmit={handleSubmit(onSuccess)} autoComplete={"off"}>
                <Grid container spacing={1}>

                    <Grid item xs={2}>
                        <Select 
                            name="accountType"
                            data={accountTypes}
                            refForm={register}
                            valueName="type"
                            labelName="displayName"
                            title={errors.accountType?.message}
                            className={errors.accountType && "input-error"}
                            onChange={e => onAccountSelected(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <DatePicker 
                            placeholder="Data Inicial"
                            refForm={register}
                            name="initialDate"
                            value={initialDateTemp}
                            onChange={setInitialDateTemp}
                            title={errors.initialDate?.message}
                            className={errors.initialDate && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <DatePicker 
                            placeholder="Data Final"
                            refForm={register}
                            name="finalDate"
                            value={finalDateTemp}
                            onChange={setFinalDateTemp}
                            title={errors.finalDate?.message}
                            className={errors.finalDate && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <button 
                            type="submit"
                            className="button" 
                            disabled={loading}
                            style={{width: 120}}
                            onClick={() => clearErrors()}
                        >
                            <span>Buscar</span>
                        </button>
                    </Grid>
                    
                </Grid>
                
            </form>
        </fieldset>
    );
}

export default Form;