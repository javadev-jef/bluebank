import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import DatePicker from "../../../components/DatePicker";
import Input from "../../../components/Input";
import InputNumberFormat from "../../../components/InputNumberFormat";
import Select from "../../../components/Select";
import { CNPJ_MASK, CPF_MASK } from "../../../constants/constants";
import { registerForm } from "../../../constants/formSchema";
import { useCities } from "../../../hooks/useCities";
import { useStates } from "../../../hooks/useStates";
import { getAgeOfMajority } from "../../../utils/functionUtils";

const Form = ({onError = ()=>{}, onSuccess = ()=>{}, loadingData, fieldErrors, serverComponents, clearForm = false}) =>
{
    const {personTypes} = serverComponents;
    const {cities, cityList} = useCities();
    const {states} = useStates();

    const [birthDateTemp, setBirthDateTemp] = useState(null);
    const {register, watch, control, handleSubmit, setError, errors, clearErrors, reset} = useForm({resolver: registerForm(true)});

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
                    <InputNumberFormat
                        useFormControl={control}
                        name="cpfCnpj"
                        placeholder={watch("personType") ? watch("personType") : "CPF/CNPJ"}
                        format={watch("personType") === "CPF" ? CPF_MASK : CNPJ_MASK}
                        title={errors.cpfCnpj?.message}
                        className={errors.cpfCnpj && "input-error"}
                    />
                </Grid>

                <Grid item xs={6}>
                    <DatePicker 
                        placeholder={watch("personType") === "CNPJ" ? "Fundação" : "Nascimento"}  
                        name="birthDate"
                        refForm={register} 
                        maxDate={getAgeOfMajority(new Date(), watch("personType"))}
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
                        disabled={cities.length === 0}
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
            <Button
                value="Realizar Cadastro"
                onClick={() => clearErrors()}
                loading={loadingData}
            />
        </form>
    );
}

export default Form;