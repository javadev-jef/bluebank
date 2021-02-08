import { Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiLogIn } from "react-icons/fi";
import { HiOutlineSave } from "react-icons/hi";
import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import InputNumberFormat from "../../../components/InputNumberFormat";
import Select from "../../../components/Select";
import { CNPJ_MASK, CPF_MASK } from "../../../constants/constants";
import { loginForm } from "../../../constants/formSchema";
import {routes} from "../../../constants/paths.json";

const Form = ({onError = ()=>{}, onSuccess = ()=>{}, loadingData, fieldErrors, serverComponents, clearForm = false}) =>
{
    const {register, handleSubmit, control, setError, clearErrors, reset, errors} = useForm({resolver: loginForm()});
    const logonTypes = serverComponents.logonTypes;
    
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
        }
    },
    [clearForm, reset]);

    return(
        <form autoComplete="off" onSubmit={handleSubmit(onSuccess)}>
            <h1>
                <span className="part-01">Olá,</span>
                <span className="part-02">seja bem-vindo!</span>
            </h1>
            <Grid container spacing={1}>
                <Grid item xs={5}>
                    <Select
                        valueName="type"
                        labelName="displayName"
                        name="logonType"
                        data={logonTypes}
                        refForm={register}
                        title={errors.logonType?.message}
                        className={errors.logonType && "input-error"}
                    />
                </Grid>
                <Grid item xs={7}>
                    <InputNumberFormat
                        useFormControl={control}
                        isNumericString={true}
                        allowLeadingZeros={true}
                        name="username"
                        allowNegative={false}
                        decimalSeparator={false}
                        placeholder="Apenas números"
                        mask={{length: 11, value: CPF_MASK}}
                        altMask={{length:14, value: CNPJ_MASK}}
                        title={errors.username?.message}
                        className={errors.username && "input-error"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <input 
                        type="password" 
                        name="password" 
                        ref={register} 
                        placeholder="Senha"
                        title={errors.password?.message}
                        className={errors.password && "input-error"}
                    />
                </Grid>
            </Grid>

            <Button 
                type="submit"
                value="Acessar"
                loading={loadingData}
                onClick={() => clearErrors()} 
                disabled={loadingData}
            />
            <Link to={routes.deposit}><HiOutlineSave /> Fazer um deposito</Link>
            <Link to={routes.register}><FiLogIn /> Quero abrir uma conta</Link>
        </form>
    );
}

export default Form;