import React, {useState, useEffect, useCallback} from "react";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { Grid } from "@material-ui/core";

import {formatCurrencyValue} from "../../../utils/functionUtils"

import Select from "../../../components/Select";
import Input from "../../../components/Input";
import DatePicker from "../../../components/DatePicker";
import Button from "../../../components/Button";

import {transferForm} from "../../../constants/formSchema";
import { API_ENDPOINT } from "../../../constants/constants";

import axios from "axios";

const Form = ({onError = () => {}, onSuccess = () => {}, loadingData = false, clearForm = false, errorServer, serverComponents}) =>
{
    const {register, errors, clearErrors, handleSubmit, watch, reset, setError} = useForm(
    {
        resolver: transferForm(new Date())
    });

    const watchAmount = watch("amount", 0);
    const [balance, setBalance] = useState(0);
    const [selectedTempDate, setSelectedTempDate] = useState(null);
    const [selectedAccountNumber, setSelectedAccountNumber] = useState();
    const {userAccountTypes, accountTypes, personTypes} = serverComponents;

    useEffect(() => 
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
    [errorServer, setError]);

    const getUserBalanceServer = useCallback(async () =>
    {
        try
        {
            const response = await axios.get(`${API_ENDPOINT}/user/account/${selectedAccountNumber}/balance`);
            setBalance(response.data.balance);
        }
        catch(error)
        {
            console.log(error);
        }
    }, [selectedAccountNumber]);

    useEffect(() => 
    {
        if(clearForm)
        {
            reset();
            setSelectedTempDate(null);
            getUserBalanceServer();
        }

    }, [clearForm, reset, getUserBalanceServer]);

    useEffect(()=>
    {
       getUserBalanceServer();   
    },
    [selectedAccountNumber, getUserBalanceServer]);

    const getBalanceCalculated = () =>
    {
        return (balance - watchAmount);
    }

    return(
        <form onSubmit={handleSubmit(onSuccess)} autoComplete={"off"}>
            <fieldset>
                <legend>Origem</legend>
                <Grid container spacing={1}>

                    <Grid item xs={4}>
                        <Select
                            placeholder="Conta"
                            name="numAccountUser" 
                            data={userAccountTypes} 
                            refForm={register}
                            valueName="numAccount"
                            labelName="accountTypeDisplayName"
                            title={errors.numAccountUser?.message}
                            onChange={e => setSelectedAccountNumber(e.target.value)}
                            className={errors.numAccountUser && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <Input 
                            placeholder="Nome do usuário"
                            name="userName" 
                            refForm={register}
                            title={errors.userName?.message}
                            className={errors.userName && "input-error"}
                        />
                    </Grid>

                </Grid>
            </fieldset>

            <fieldset>
                <legend>Destino</legend>
                <Grid container spacing={1}>

                    <Grid item xs={3}>
                        <Input 
                            placeholder="Nº Conta" 
                            name="numAccount" 
                            refForm={register}
                            title={errors.numAccount?.message}
                            className={errors.numAccount && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Select 
                            data={accountTypes}
                            name="accountType"
                            placeholder="Conta"
                            refForm={register}
                            valueName="type"
                            labelName="displayName"
                            title={errors.accountType?.message}
                            className={errors.accountType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Input 
                            placeholder="Favorecido" 
                            name="favoredName" 
                            refForm={register}
                            title={errors.favoredName?.message}
                            className={errors.favoredName && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Select 
                            placeholder="Tipo"
                            data={personTypes}
                            refForm={register}
                            name="personType"
                            valueName="type"
                            labelName="displayName"
                            title={errors.personType?.message}
                            className={errors.personType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Input 
                            placeholder={watch("personType") ? watch("personType") : "CPF/CNPJ"} 
                            refForm={register}
                            disabled={!watch("personType")}
                            name="cpfCnpj"
                            title={errors.cpfCnpj?.message}
                            className={errors.cpfCnpj && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Input 
                            placeholder="Valor" 
                            refForm={register}
                            name="amount"
                            title={errors.amount?.message}
                            className={errors.amount && "input-error"}
                            disabled={balance === 0}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Input 
                            placeholder="Descrição (Opcional)" 
                            name="description" 
                            refForm={register}
                            title={errors.description?.message}
                            className={errors.description && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <DatePicker 
                            name="whenToDo" 
                            value={selectedTempDate} 
                            refForm={register}
                            onChange={setSelectedTempDate}
                            placeholder="Para quando?"
                            disablePast={true} 
                            className={errors.whenToDo && "input-error"}
                            title={errors.whenToDo?.message}
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
                    <span>Valor da transferência</span>
                </div>

                <div className="span-group">
                    <span>
                        {formatCurrencyValue(getBalanceCalculated() > 0 ? getBalanceCalculated() : 0)}
                    </span>
                    <span>Saldo após transferência</span>
                </div>

            </fieldset>
  
            <div className="input-group">
                <Button 
                    type="submit"
                    value="Transferir"
                    style={{width: 180}} 
                    loading={loadingData}
                    onClick={() => clearErrors()} 
                    disabled={loadingData || balance === 0 || watchAmount > balance}
                />
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