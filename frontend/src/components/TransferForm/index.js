import React, {useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Grid, CircularProgress } from "@material-ui/core";
import {formatCurrencyValue} from "../../utils/functionUtils"
import Select from "../Select";
import Input from "../Input";
import DatePicker from "../DatePicker";
import { Link } from "react-router-dom";
import {transferForm} from "../../constants/formSchema";

const TransferForm = ({onError = (error) => {}, defaultValues = {balance: 0}, onSuccess = (data) => {}, loadingData = false, clearForm = false}) =>
{
    const {register, errors, clearErrors, handleSubmit, watch, reset} = useForm(
    {
        resolver: transferForm(new Date()),
        defaultValues: defaultValues,
    });

    const [selectedTempDate, setSelectedTempDate] = useState(null);
    const watchTransferValue = watch("transferValue", 0);

    const accountTypes = [
        {id: 1, description: "Corrente"},
        {id: 2, description: "Poupança"}
    ];

    const personTypes = [
        {id: 1, initials: "CPF", description: "Pessoa Física"},
        {id: 2, initials: "CNPJ", description: "Pessoa Juridica"}
    ];

    useEffect(() => 
    {
        onError(errors);
    }, [errors, onError]);

    useEffect(() => 
    {
        reset()
        setSelectedTempDate(null);

    }, [clearForm, reset]);

    return(
        <form onSubmit={handleSubmit(onSuccess)} autoComplete={"off"}>
            <fieldset>
                <legend>Origem</legend>
                <Grid container spacing={1}>

                    <Grid item xs={4}>
                        <Select
                            data={accountTypes} 
                            name="originAccountType" 
                            refForm={register}
                            placeholder="Tipo"
                            title={errors.originAccountType?.message}
                            className={errors.originAccountType && "input-error"}
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
                            placeholder="Conta" 
                            name="numDestinationAccount" 
                            refForm={register}
                            title={errors.numDestinationAccount?.message}
                            className={errors.numDestinationAccount && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Select 
                            data={accountTypes}
                            name="destinationAccountType"
                            placeholder="Tipo"
                            refForm={register}
                            title={errors.destinationAccountType?.message}
                            className={errors.destinationAccountType && "input-error"}
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
                            data={personTypes}
                            refForm={register}
                            name="personType"
                            title={errors.personType?.message}
                            className={errors.personType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Input 
                            placeholder={personTypes[watch("personType", 1) - 1].initials} 
                            refForm={register}
                            name="destinationPersonType"
                            title={errors.destinationPersonType?.message}
                            className={errors.destinationPersonType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Input 
                            placeholder="Valor" 
                            refForm={register}
                            name="transferValue"
                            title={errors.transferValue?.message}
                            className={errors.transferValue && "input-error"}
                            disabled={defaultValues.balance === 0}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Input 
                            placeholder="Descrição (Opcional)" 
                            name="transferDescription" 
                            refForm={register}
                            title={errors.transferDescription?.message}
                            className={errors.transferDescription && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <DatePicker 
                            name="transferDate" 
                            value={selectedTempDate} 
                            refForm={register}
                            onChange={setSelectedTempDate}
                            placeholder="Para quando?"
                            disablePast={true} 
                            className={errors.transferDate && "input-error"}
                            title={errors.transferDate?.message}
                        />
                    </Grid>
                    
                </Grid>
            </fieldset>

            <fieldset>
                <legend>Resumo</legend>
                <div className="span-group">
                    <span>{formatCurrencyValue(defaultValues.balance)}</span>
                    <span>Saldo em conta</span>
                </div>

                <div className="span-group">
                    <span style={watchTransferValue > defaultValues.balance ? {color: "red"} : {}}>
                        {formatCurrencyValue(watchTransferValue)}
                    </span>
                    <span>Valor da transferência</span>
                </div>

                <div className="span-group">
                    <span>
                        {defaultValues.balance - watchTransferValue > 0 
                            ? 
                                formatCurrencyValue(defaultValues.balance - watchTransferValue)
                            : 
                                formatCurrencyValue(0)
                        }
                    </span>
                    <span>Saldo após transferência</span>
                </div>

            </fieldset>
  
            <div className="input-group">
                <button 
                    type="submit"
                    className="button" 
                    style={{width: 180}} 
                    onClick={() => clearErrors()} 
                    disabled={loadingData || defaultValues.balance === 0} 
                >
                    {loadingData ? <CircularProgress style={{color: "#FFF"}}/> : "Transferir"}
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

export default TransferForm;