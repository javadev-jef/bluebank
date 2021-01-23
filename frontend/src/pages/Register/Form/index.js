import React, { useEffect, useState } from "react";

import { CircularProgress, Grid } from "@material-ui/core";
import DatePicker from "../../../components/DatePicker";
import Input from "../../../components/Input";
import Select from "../../../components/Select";

import { registerForm } from "../../../constants/formSchema";

import { useForm } from "react-hook-form";
import { useCities } from "../../../hooks/useCities";
import { useStates } from "../../../hooks/useStates";

import { getAgeOfMajority } from "../../../utils/functionUtils";

const Form = ({onError = ()=>{}, onSuccess = ()=>{}, loadingData, serverComponents, errorServer, clearForm = false}) =>
{
    const {cities, cityList} = useCities();
    const {states} = useStates();
    const {personTypes} = serverComponents;

    const [birthDateTemp, setBirthDateTemp] = useState(null);
    const {register, watch, handleSubmit, setError, errors, clearErrors, reset} = useForm({resolver: registerForm(true)});

    useEffect(() => 
    {
        onError(errors);
    }, 
    [errors, onError]);

    // SET MANUAL ERRORS TO REACT-HOOK-FORM
    useEffect(()=>
    {
        for(const error in errorServer)
        {
            setError(error, {message: errorServer[error]});
        }
    }, 
    [errorServer, setError]);

    useEffect(() => 
    {
        if(clearForm)
        {
            reset();
            setBirthDateTemp(null);
        }
    },
    [clearForm, reset]);

    return(
        <form autoComplete="off" onSubmit={handleSubmit(onSuccess)}>
            <Grid container spacing={1}>

                <Grid item xs={8}>
                    <Input 
                        placeholder="Nome Completo"
                        name="name"  
                        refForm={register} 
                        title={errors.name?.message}
                        className={errors.name && "input-error"}
                    />
                </Grid>

                <Grid item xs={4}>
                    <Select
                        placeholder="Tipo"
                        valueName="type"
                        labelName="displayName"
                        name="personType"
                        data={personTypes}
                        refForm={register}
                        title={errors.personType?.message}
                        className={errors.personType && "input-error"}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Input 
                        placeholder={watch("personType") ? watch("personType") : "CPF/CNPJ"}
                        name="cpfCnpj"   
                        refForm={register} 
                        title={errors.cpfCnpj?.message}
                        className={errors.cpfCnpj && "input-error"}
                    />
                </Grid>

                <Grid item xs={6}>
                    <DatePicker 
                        placeholder="Nascimento"  
                        name="birthDate"
                        refForm={register} 
                        maxDate={getAgeOfMajority(new Date())}
                        value={birthDateTemp}
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
                        valueName="id"
                        labelName="sigla"
                        name="stateId"
                        onChange={e => cityList(e.target.value)}
                        data={states}
                        refForm={register}
                        title={errors.stateId?.message}
                        className={errors.stateId && "input-error"}
                    />
                </Grid>

                <Grid item xs={8}>
                    <Select
                        placeholder="Cidade"
                        valueName="id"
                        labelName="nome"
                        name="cityId"
                        data={cities}
                        refForm={register}
                        title={errors.cityId?.message}
                        className={errors.cityId && "input-error"}
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
                {loadingData ? <CircularProgress style={{color: "#FFF"}}/> : "Realizar Cadastro"}
            </button>
        </form>
    );
}

export default Form;