import { Grid } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAttachFile } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import InputDecimalFormat from "../../../components/InputDecimalFormat";
import InputNumberFormat from "../../../components/InputNumberFormat";
import Select from "../../../components/Select";
import { API_ENDPOINT, CNPJ_MASK, CPF_MASK, PHONE_MASK_01, PHONE_MASK_02 } from "../../../constants/constants";
import { depositForm } from "../../../constants/formSchema";
import { routes } from "../../../constants/paths.json";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import { isEmptyString } from "../../../utils/functionUtils";


const Form = ({onSuccess = () =>{}, onError = () =>{}, isUserLogged = false, loadingData = false, serverComponents, clearForm, fieldErrors}) =>
{
    const {register, control, clearErrors,setError, errors, handleSubmit, reset} = useForm({resolver: depositForm()});

    const {accountTypes, cashTypes} = serverComponents;

    const [selectedCashType, setSelectedCashType] = useState("");
    const [favoredName, setFavoredName] = useState("");
    const {getResponseHandled} = useHandleResponseError();

    useEffect(() => 
    {
        onError(errors);
    }, 
    [errors, onError]);

    useEffect(()=>
    {
        if(clearForm)
        {
            reset();
            setFavoredName("");
        }
    },
    [clearForm, reset]);

    // SET MANUAL ERRORS TO REACT-HOOK-FORM
    useEffect(()=>
    {
        for(const error in fieldErrors)
        {
            setError(error, {message: fieldErrors[error]});
        }
    },
    [fieldErrors, setError]);

    const fetchFavoredName = async (e) =>
    {
        try
        {
            const numAccount = e.target.value;

            if(!isEmptyString(numAccount))
            {
                const {data} = await axios.get(`${API_ENDPOINT}/account/fetchFavoredName/${numAccount}`);
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
                <legend>Destinatário</legend>
                <Grid container spacing={1}>

                    <Grid item xs={3}>
                        <Input 
                            name="numAccount"
                            placeholder="Conta"
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
                            placeholder="Tipo"
                            refForm={register}
                            valueName="type"
                            labelName="displayName"
                            title={errors.accountType?.message}
                            className={errors.accountType && "input-error"}
                        />   
                    </Grid>

                    <Grid item xs={6}>
                        <Input 
                            name="favoredName"
                            placeholder="Nome do Destinatário"
                            refForm={register}
                            value={favoredName}
                            readOnly
                        />
                    </Grid>

                </Grid>
            </fieldset>
            <fieldset>
                <legend>Dados para Depósito</legend>
                <Grid container spacing={1}>

                    <Grid item xs={6}>
                        <Input 
                            name="depositorName"
                            placeholder="Depositante"
                            refForm={register}
                            title={errors.depositorName?.message}
                            className={errors.depositorName && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <InputNumberFormat
                            useFormControl={control}
                            name="cpfCnpj"
                            placeholder="CPF/CNPJ"
                            mask={{length: 11, value: CPF_MASK}}
                            altMask={{length:14, value: CNPJ_MASK}}
                            title={errors.cpfCnpj?.message}
                            className={errors.cpfCnpj && "input-error"}
                            allowNegative={false}
                            decimalSeparator={false}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <InputNumberFormat
                            useFormControl={control}
                            name="phone"
                            placeholder="Telefone"
                            mask={{length: 10, value: PHONE_MASK_01}}
                            altMask={{length:11, value: PHONE_MASK_02}}
                            title={errors.phone?.message}
                            className={errors.phone && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Select 
                            data={cashTypes}
                            name="cashType"
                            placeholder="Deposito em"
                            valueName="type"
                            labelName="displayName"
                            refForm={register}
                            title={errors.cashType?.message}
                            className={errors.cashType && "input-error"}
                            onChange={e => setSelectedCashType(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        {
                            selectedCashType === 'BLUECOIN'
                            ?
                                <>
                                <label 
                                    htmlFor="bluecoin-file"
                                    title={errors.bluecoinFile?.message}
                                    className={errors.bluecoinFile ? "input-error button-file" : 'button-file'}>
                                    <MdAttachFile />
                                    <span>Anexar</span>
                                </label>
                                <Input 
                                    id="bluecoin-file" 
                                    type="file" 
                                    hidden
                                    refForm={register}
                                    name="bluecoinFile"
                                    multiple={false}
                                />
                                </>
                            :  
                                <InputDecimalFormat
                                    placeholder="Valor Depósito"
                                    useFormControl={control}
                                    name="amount"
                                    title={errors.amount?.message}
                                    className={errors.amount && "input-error"}
                                />
                        }
                    </Grid>

                </Grid>
                
            </fieldset>
            
            <div className="input-group">
                <Button 
                    style={{width: 180}}
                    onClick={() => clearErrors()}
                    loading={loadingData}
                    value="Depositar"
                />
                <Link 
                    style={{width: 180}}
                    to={loadingData ? "#" : isUserLogged ? routes.home : routes.logon} 
                    className={`button-cancel ${loadingData && 'disabled'}`} 
                >
                        <span>Voltar</span>
                </Link>
            </div>
        </form>
    );
}

export default Form;