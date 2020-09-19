import React, { useCallback } from "react";
import {Grid, CircularProgress} from "@material-ui/core";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import { useState } from "react";
import { formatCurrencyValue } from "../../../utils/functionUtils";
import { Link } from "react-router-dom";
import { withdrawForm } from "../../../constants/formSchema";
import { useEffect } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../../constants/constants";

const Form = ({loadingData = false, onSuccess = ()=>{}, onError = ()=>{}, errorServer, serverComponents, clearForm}) =>
{
    const {register, errors, setError, handleSubmit, clearErrors, watch, reset} = useForm({resolver: withdrawForm()});
    const [balance, setBalance] = useState(0);
    const watchAmount = watch("amount", 0);
    const {accountTypes, withdrawTypes} = serverComponents;
    const [selectedAccountType, setSelectedAccountType] = useState();

    useEffect(()=>
    {
        onError(errors);
    }, 
    [errors, onError]);

    // Set manual errors to react-hook-form
    useEffect(()=>
    {
        for(const error in errorServer)
        {
            setError(error, {message: errorServer[error]});
        }
    }, 
    [errorServer, setError])

    const getBalanceServer = useCallback(async () =>
    {
        try
        {
            const response = await axios.get(`${API_ENDPOINT}/user/account/${selectedAccountType}/balance`);
            setBalance(response.data.balance);
        }
        catch(error)
        {
            console.log(error);
        }
    }, 
    [selectedAccountType]);
    
    useEffect(()=>
    {
        if(clearForm)
        {
            reset();
            getBalanceServer();
        }
    },
    [clearForm, reset, getBalanceServer])

    useEffect(()=>
    {
        selectedAccountType !== undefined && getBalanceServer();
    },
    [selectedAccountType, getBalanceServer]);

    const getBalanceCalculated = () =>
    {
        return watchAmount < 0 ? 0 : (balance - watchAmount);
    }

    return(
        <form autoComplete={"off"} onSubmit={handleSubmit(onSuccess)}>
            <fieldset>
                <legend>Dados para Saque</legend>
                <Grid container spacing={1}>

                    <Grid item xs={4}>
                        <Select
                            placeholder="Origem"
                            data={accountTypes} 
                            name="accountType" 
                            refForm={register}
                            labelName="displayName"
                            valueName="type"
                            title={errors.accountType?.message}
                            className={errors.accountType && "input-error"}
                            onChange={(e) => setSelectedAccountType(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <Input 
                            placeholder="Nome do usuário"
                            name='userName' 
                            refForm={register}
                            title={errors.userName?.message}
                            className={errors.userName && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={5}>
                        <Select 
                            data={withdrawTypes}
                            name='type'
                            placeholder="Sacar em"
                            refForm={register}
                            valueName="type"
                            labelName="displayName"
                            title={errors.type?.message}
                            className={errors.type && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={7}>
                       <Input 
                            mask={"9.999,99"}
                            placeholder="Valor"
                            name="amount" 
                            refForm={register}
                            title={errors.amount?.message}
                            className={errors.amount && "input-error"}
                       />

                    </Grid>
                </Grid>
            </fieldset>

            <fieldset>
                <legend>Resumo</legend>
                
                <div className="span-group">
                    <span>{formatCurrencyValue(balance)}</span>
                    <span>Saldo em conta</span>
                </div>

                <div className="span-group">
                    <span style={watchAmount > balance ? {color: "red"} : {}}>
                        {formatCurrencyValue(watchAmount)}
                    </span>
                    <span>Valor do saque</span>
                </div>

                <div className="span-group">
                    <span>
                        {formatCurrencyValue(getBalanceCalculated() > 0 ? getBalanceCalculated() : 0)}
                    </span>
                    <span>Saldo após saque</span>
                </div>

            </fieldset>

            <div className="input-group">
                <button 
                    type="submit"
                    className="button" 
                    style={{width: 180}} 
                    onClick={() => clearErrors()} 
                    disabled={loadingData || balance === 0 || watchAmount > balance} 
                >
                    {loadingData ? <CircularProgress style={{color: "#FFF"}}/> : "Realizar Saque"}
                </button>
                <Link 
                    style={{width: 180}}
                    to={loadingData ? "#" : "/home"} 
                    className={`button-cancel ${loadingData && 'disabled'}`} 
                >
                        <span>Voltar</span>
                </Link>
            </div>
        </form>
    );
}

export default Form;