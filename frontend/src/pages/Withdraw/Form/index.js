import { Grid } from "@material-ui/core";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import InputDecimalFormat from "../../../components/InputDecimalFormat";
import Select from "../../../components/Select";
import { API_ENDPOINT } from "../../../constants/constants";
import { withdrawForm } from "../../../constants/formSchema";
import { AuthContext } from "../../../hooks/useAuth";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import { formatCurrencyValue } from "../../../utils/functionUtils";
import {routes} from "../../../constants/paths.json";

const Form = ({loadingData = false, onSuccess = ()=>{}, onError = ()=>{}, fieldErrors, serverComponents, clearForm}) =>
{
    const {register, control, errors, setError, handleSubmit, clearErrors, watch, reset} = useForm({resolver: withdrawForm()});
    const [balance, setBalance] = useState(0);
    const watchAmount = watch("amount", 0);
    const {accountTypes, cashTypes} = serverComponents;
    const [selectedAccountType, setSelectedAccountType] = useState();
    const {buildAuthHeader, credentials} = useContext(AuthContext);
    const {getResponseHandled} = useHandleResponseError();

    useEffect(()=>
    {
        onError(errors);
    }, 
    [errors, onError]);

    // SET MANUAL ERRORS TO REACT-HOOK-FORM
    useEffect(()=>
    {
        for(const error in fieldErrors)
        {
            setError(error, {message: fieldErrors[error]});
        }
    }, 
    [fieldErrors, setError])

    const getBalanceServer = useCallback(async () =>
    {
        try
        {
            const {data} = await axios.get(`${API_ENDPOINT}/user/account/${selectedAccountType}/balance`, buildAuthHeader());
            setBalance(data.balance);
        }
        catch(error)
        {
            getResponseHandled(error);
        }
    }, 
    [selectedAccountType, buildAuthHeader, getResponseHandled]);
    
    useEffect(()=>
    {
        if(clearForm)
        {
            reset();
            setBalance(0);
            setSelectedAccountType(undefined);
        }
    },
    [clearForm, reset])

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
                            value={credentials.name}
                            readOnly
                        />
                    </Grid>

                    <Grid item xs={5}>
                        <Select 
                            data={cashTypes}
                            name='cashType'
                            placeholder="Sacar em"
                            refForm={register}
                            valueName="type"
                            labelName="displayName"
                            title={errors.cashType?.message}
                            className={errors.cashType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={7}>
                        <InputDecimalFormat
                            placeholder="Valor"
                            useFormControl={control}
                            name="amount"
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
                <Button
                    style={{width: 180}} 
                    onClick={() => clearErrors()} 
                    disabled={balance === 0 || watchAmount > balance}
                    loading={loadingData}
                    value="Realizar Saque"
                />
                <Link 
                    style={{width: 180}}
                    to={loadingData ? "#" : routes.home} 
                    className={`button-cancel ${loadingData && 'disabled'}`} 
                >
                        <span>Voltar</span>
                </Link>
            </div>
        </form>
    );
}

export default Form;