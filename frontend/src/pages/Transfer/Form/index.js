import React, {useState, useEffect, useCallback, useContext} from "react";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { Grid } from "@material-ui/core";

import {formatCurrencyValue, isEmptyString} from "../../../utils/functionUtils"

import Select from "../../../components/Select";
import Input from "../../../components/Input";
import DatePicker from "../../../components/DatePicker";
import Button from "../../../components/Button";

import {transferForm} from "../../../constants/formSchema";
import { API_ENDPOINT, CNPJ_MASK, CPF_MASK } from "../../../constants/constants";

import axios from "axios";
import InputDecimalFormat from "../../../components/InputDecimalFormat";
import InputNumberFormat from "../../../components/InputNumberFormat";
import { AuthContext } from "../../../hooks/useAuth";
import {routes} from "../../../constants/paths.json";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";

const Form = ({onError = () => {}, onSuccess = () => {}, loadingData = false, clearForm = false, fieldErrors, serverComponents}) =>
{
    const {register, errors, control, clearErrors, handleSubmit, watch, reset, setError} = useForm(
    {
        resolver: transferForm(),
    });

    const watchAmount = watch("amount", 0);
    const [balance, setBalance] = useState(0);
    const [selectedTempDate, setSelectedTempDate] = useState(null);
    const [selectedAccountType, setSelectedAccountType] = useState();
    const {accountTypes, personTypes} = serverComponents;
    const {credentials, buildAuthHeader} = useContext(AuthContext);
    const [favoredName, setFavoredName] = useState("");
    const {getResponseHandled} = useHandleResponseError();

    useEffect(() => 
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
    [fieldErrors, setError]);

    const getUserBalanceServer = useCallback(async () =>
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

    useEffect(() => 
    {
        if(clearForm)
        {
            reset({});
            setSelectedTempDate(null);
            getUserBalanceServer();
            setFavoredName("");
        }

    }, [clearForm, reset, getUserBalanceServer]);

    useEffect(()=>
    {
        selectedAccountType !== undefined && getUserBalanceServer();   
    },
    [selectedAccountType, getUserBalanceServer]);

    const getBalanceCalculated = () =>
    {
        return (balance - watchAmount);
    }

    const fetchFavoredName = async (e) =>
    {
        try
        {
            const numAccount = e.target.value;

            if(!isEmptyString(numAccount))
            {
                const {data} = await axios.get(`${API_ENDPOINT}/account/fetchFavoredName/${numAccount}`, buildAuthHeader());
                setFavoredName(data);
            }
        }
        catch(error)
        {
            setFavoredName("");
            getResponseHandled(error);
        }
    }

    return(
        <form onSubmit={handleSubmit(onSuccess)} autoComplete={"off"}>
            <fieldset>
                <legend>Origem</legend>
                <Grid container spacing={1}>

                    <Grid item xs={4}>
                        <Select
                            placeholder="Conta"
                            name="userAccountType" 
                            data={accountTypes} 
                            refForm={register}
                            labelName="displayName"
                            valueName="type"
                            title={errors.userAccountType?.message}
                            onChange={e => setSelectedAccountType(e.target.value)}
                            className={errors.userAccountType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <Input 
                            placeholder="Nome do usuário"
                            name="userName"
                            defaultValue={credentials.name}
                            readOnly
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
                            onBlur={fetchFavoredName}
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
                            defaultValue={favoredName}
                            readOnly
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
                        <InputNumberFormat
                            useFormControl={control}
                            name="cpfCnpj"
                            placeholder={watch("personType") ? watch("personType") : "CPF/CNPJ"}
                            format={watch("personType") === "CPF" ? CPF_MASK : CNPJ_MASK}
                            title={errors.cpfCnpj?.message}
                            className={errors.cpfCnpj && "input-error"}
                            disabled={!watch("personType") || clearForm}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <InputDecimalFormat
                            placeholder="Valor"
                            useFormControl={control}
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