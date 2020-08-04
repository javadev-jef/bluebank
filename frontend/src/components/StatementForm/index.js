import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Select from "../Select";
import DatePicker from "../DatePicker";
import { useForm } from "react-hook-form";
import { getInitialDateOfMonth, getFinalDateOfMonth } from "../../utils/functionUtils";
import { statementForm } from "../../constants/formSchema";

const StatementForm = ({onSuccess = () => {}, onError = () => {}, loading}) =>
{
    const [initialDateTemp, setInitialDateTemp] = useState(getInitialDateOfMonth());
    const [selectFinalDateTemp, setSelectFinalDateTemp] = useState(getFinalDateOfMonth());
    
    const {register, handleSubmit, errors, clearErrors} = useForm(
    {
        resolver: statementForm(initialDateTemp, selectFinalDateTemp), 
        reValidateMode: "onSubmit",
    });

    const accountTypes = [
        {id: 1, description: "Corrente"},
        {id: 2, description: "Poupança"}
    ];

    useEffect(()=>
    {
        onError(errors);
    }, 
    [errors, onError])

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
                            title={errors.accountType?.message}
                            className={errors.accountType && "input-error"}
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
                            value={selectFinalDateTemp}
                            onChange={setSelectFinalDateTemp}
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

export default StatementForm;