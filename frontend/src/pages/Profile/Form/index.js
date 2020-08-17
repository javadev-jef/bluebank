import React, { useEffect, useState } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import DatePicker from "../../../components/DatePicker";
import Select from "../../../components/Select";
import { useEstados } from "../../../hooks/useEstados";
import { useCidades } from "../../../hooks/useCidades";
import { registerForm } from "../../../constants/formSchema";
import { getAgeOfMajority } from "../../../utils/functionUtils";

const Form = ({onError = ()=>{}, onSuccess = ()=>{}, loadingData}) =>
{
    const cidadesIbge = useCidades();
    const estadosIbge = useEstados();
    const [bithDateTemp, setBirthDateTemp] = useState(null);
    
    const {register, watch, getValues, handleSubmit, errors, clearErrors, reset} = useForm({resolver: registerForm()});


    //Executes when loading states
    useEffect(()=>
    {
        // Loads initial data
        reset({
            state: 31,
            email: "myemail@myemail.com"
        })
    }, 
    [estadosIbge.estados])

    useEffect(() => 
    {
        estadosIbge.list();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => 
    { 
        // Reports the loading of cidades as a option
        cidadesIbge.setCidades([{id: 0, nome: "Carregando..."}]);
        cidadesIbge.list(getValues("state"));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 
    [watch("state")]);

    useEffect(() => 
    {
        onError(errors);
    }, 
    [errors, onError])
    
    return(
        <form autoComplete="off" onSubmit={handleSubmit(onSuccess)}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Input 
                        placeholder="Nome Completo"
                        name="name"  
                        refForm={register} 
                        title={errors.name?.message}
                        className={errors.name && "input-error"}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Input 
                        placeholder="CPF" 
                        name="numPersonType"   
                        refForm={register} 
                        title={errors.numPersonType?.message}
                        className={errors.numPersonType && "input-error"}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DatePicker 
                        placeholder="Nascimento"  
                        name="birthDate" 
                        refForm={register} 
                        maxDate={getAgeOfMajority(new Date())}
                        value={bithDateTemp}
                        onChange={setBirthDateTemp}
                        title={errors.birthDate?.message}
                        className={errors.birthDate && "input-error"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Input 
                        placeholder="E-mail"   
                        name="email"
                        refForm={register}  
                        title={errors.email?.message}
                        className={errors.email && "input-error"}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Select
                        placeholder="Estado"
                        valueOptName="id"
                        descOptName="sigla"
                        name="state"
                        data={estadosIbge.estados}
                        refForm={register}
                        title={errors.state?.message}
                        className={errors.state && "input-error"}
                    />
                </Grid>
                <Grid item xs={8}>
                    <Select
                        placeholder="Cidade"
                        valueOptName="id"
                        descOptName="nome"
                        name="city"
                        data={cidadesIbge.cidades}
                        refForm={register}
                        title={errors.city?.message}
                        className={errors.city && "input-error"}
                        disabled={cidadesIbge.cidades.length === 0}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Input 
                        type="password"
                        placeholder="Senha" 
                        name="password"  
                        refForm={register}  
                        title={errors.password?.message}
                        className={errors.password && "input-error"}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Input 
                        type="password"
                        placeholder="Repetir Senha"  
                        name="passwordConfirm"  
                        refForm={register} 
                        title={errors.passwordConfirm?.message}
                        className={errors.passwordConfirm && "input-error"}
                    />
                </Grid>
            </Grid>
            <button 
                type="submit"
                className="button" 
                onClick={() => clearErrors()} 
                disabled={loadingData} 
            >
                {loadingData ? <CircularProgress style={{color: "#FFF"}}/> : "Realizar Alterações"}
            </button>
        </form>
    );
}

export default Form;