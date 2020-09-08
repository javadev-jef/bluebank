import React, { useState, useEffect, useCallback } from "react";
import { Grid } from "@material-ui/core";
import Select from "../../../components/Select";
import { useForm } from "react-hook-form";
import { getInitialDateOfMonth, getFinalDateOfMonth } from "../../../utils/functionUtils";
import { statementForm } from "../../../constants/formSchema";
import { API_ENDPOINT } from "../../../constants/constants";
import axios from "axios";
import DatePicker from "../../../components/DatePicker";

const Form = ({onSuccess = () => {}, onError = () => {}, loading, onChangeAccount = () =>{}}) =>
{
    const [initialDateTemp, setInitialDateTemp] = useState(getInitialDateOfMonth());
    const [finalDateTemp, setFinalDateTemp] = useState(getFinalDateOfMonth());
    const [userAccountTypes, setUserAccountTypes] = useState([]);
    
    const {register, handleSubmit, errors, clearErrors, getValues} = useForm(
    {
        resolver: statementForm(initialDateTemp, finalDateTemp), 
        reValidateMode: "onSubmit",
    });

    const listUserAccounts = useCallback(async () =>
    {
        try
        {
            const response = await axios.get(`${API_ENDPOINT}/user/accounts`);
            setUserAccountTypes(response.data);
            console.log(response);

            onChangeAccount(getValues("numAccount"));
        }
        catch(error)
        {
            console.log(error);
        }
    }, [getValues, onChangeAccount]);

    useEffect(()=>
    {
        listUserAccounts();
    }, [listUserAccounts])

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
                            name="numAccount"
                            data={userAccountTypes}
                            refForm={register}
                            valueName="numAccount"
                            labelName="accountTypeDisplayName"
                            title={errors.numAccount?.message}
                            className={errors.numAccount && "input-error"}
                            onChange={e => onChangeAccount(e.target.value)}
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