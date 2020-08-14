import React from "react";
import {Grid, CircularProgress} from "@material-ui/core";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import { useState } from "react";
import { formatCurrencyValue } from "../../../utils/functionUtils";
import { Link } from "react-router-dom";
import { withdrawForm } from "../../../constants/formSchema";
import { useEffect } from "react";

const Form = ({loadingData = false, onSuccess = ()=>{}, onError = ()=>{}}) =>
{
    const {register, errors, handleSubmit, clearErrors, watch} = useForm({resolver: withdrawForm(), defaultValues: {withdrawValue: 0}});
    const [balance, setBalance] = useState(0);
    const watchWithdrawValue = watch("withdrawValue", 0);
    

    const withdrawTypes = [
        {id: 1, description: "Dinheiro"},
        {id: 2, description: "BlueCoin"}
    ];

    const accountTypes = [
        {id: 1, description: "Corrente"},
        {id: 2, description: "Poupança"}
    ];

    useEffect(()=>{setBalance(1500)},[])

    useEffect(()=>
    {
        onError(errors);
    }, 
    [errors, onError]);

    return(
        <form autoComplete={"off"} onSubmit={handleSubmit(onSuccess)}>
            <fieldset>
                <legend>Dados para Saque</legend>
                <Grid container spacing={1}>

                    <Grid item xs={4}>
                        <Select
                            data={accountTypes} 
                            name="userAccountType" 
                            refForm={register}
                            placeholder="Origem"
                            title={errors.userAccountType?.message}
                            className={errors.userAccountType && "input-error"}
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
                            name='withdrawType'
                            placeholder="Sacar em"
                            refForm={register}
                            title={errors.withdrawType?.message}
                            className={errors.withdrawType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                       <Input 
                            mask={"9.999,99"}
                            placeholder="Valor"
                            name="withdrawValue" 
                            refForm={register}
                            title={errors.withdrawValue?.message}
                            className={errors.withdrawValue && "input-error"}
                       />

                    </Grid>
                    <Grid item xs={3}>
                        <Input 
                            placeholder="Senha"
                            type="password"
                            name="blueToken" 
                            refForm={register}
                            title={errors.blueToken?.message}
                            className={errors.blueToken && "input-error"}
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
                    <span style={watchWithdrawValue > balance ? {color: "red"} : {}}>
                        {formatCurrencyValue(watchWithdrawValue)}
                    </span>
                    <span>Valor do saque</span>
                </div>

                <div className="span-group">
                    <span>
                        {balance - watchWithdrawValue > 0 
                            ? 
                                formatCurrencyValue(balance - watchWithdrawValue)
                            : 
                                formatCurrencyValue(0)
                        }
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
                    disabled={loadingData || balance === 0 || watchWithdrawValue > balance} 
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