import React from "react";
import { useForm } from "react-hook-form";
import { Grid, CircularProgress } from "@material-ui/core";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import { depositForm } from "../../../constants/formSchema";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Form = ({onSuccess = () =>{}, onError = () =>{}, isUserLogged = false, loadingData = false}) =>
{
    const {register, clearErrors, errors, handleSubmit} = useForm({resolver: depositForm()});
    
    //TODO: Fetch accountTypes and depositTypes from the database
    const accountTypes = [
        {id: 1, description: "Corrente"},
        {id: 2, description: "Poupança"}
    ];

    const depositTypes = [
        {id: 1, description: "Dinheiro"},
        {id: 2, description: "Cheque"}
    ];

    useEffect(() => 
    {
        onError(errors);
    }, 
    [errors, onError])
    
    return(
        <form onSubmit={handleSubmit(onSuccess)} autoComplete={"off"}>
            <fieldset>
                <legend>Destinatário</legend>
                <Grid container spacing={1}>

                    <Grid item xs={3}>
                        <Input 
                            name="recipientAccount"
                            placeholder="Conta"
                            refForm={register}
                            title={errors.recipientAccount?.message}
                            className={errors.recipientAccount && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <Select 
                            data={accountTypes}
                            name="recipientAccountType"
                            placeholder="Tipo"
                            refForm={register}
                            title={errors.recipientAccountType?.message}
                            className={errors.recipientAccountType && "input-error"}
                        />   
                    </Grid>

                    <Grid item xs={6}>
                        <Input 
                            name="recipientName"
                            placeholder="Nome do Destinatário"
                            refForm={register}
                            title={errors.recipientName?.message}
                            className={errors.recipientName && "input-error"}
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
                        <Input 
                            name="depositorNumPersonType"
                            placeholder="CPF/CNPJ"
                            refForm={register}
                            title={errors.depositorNumPersonType?.message}
                            className={errors.depositorNumPersonType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Input 
                            name="depositorPhone"
                            placeholder="Telefone"
                            refForm={register}
                            title={errors.depositorPhone?.message}
                            className={errors.depositorPhone && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Select 
                            data={depositTypes}
                            name="depositType"
                            placeholder="Deposito em"
                            refForm={register}
                            title={errors.depositType?.message}
                            className={errors.depositType && "input-error"}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Input 
                            name="depositValue"
                            placeholder="Valor Depósito"
                            refForm={register}
                            title={errors.depositValue?.message}
                            className={errors.depositValue && "input-error"}
                        />
                    </Grid>

                </Grid>
            </fieldset>
            
            <div className="input-group">
                <button 
                    type="submit"
                    className="button" 
                    style={{width: 180}} 
                    onClick={() => clearErrors()} 
                    disabled={loadingData} 
                >
                    {loadingData ? <CircularProgress style={{color: "#FFF"}}/> : "Depositar"}
                </button>
                <Link 
                    style={{width: 180}}
                    to={loadingData ? "#" : isUserLogged ? "/home" : "/"} 
                    className={`button-cancel ${loadingData && 'disabled'}`} 
                >
                        <span>Voltar</span>
                </Link>
            </div>
        </form>
    );
}

export default Form;