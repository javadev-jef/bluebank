import { Backdrop, CircularProgress, Grid } from "@material-ui/core";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import DatePicker from "../../../components/DatePicker";
import Input from "../../../components/Input";
import InputNumberFormat from "../../../components/InputNumberFormat";
import Select from "../../../components/Select";
import { API_ENDPOINT, CNPJ_MASK, CPF_MASK, DATE_FORMAT } from "../../../constants/constants";
import { registerForm } from "../../../constants/formSchema";
import { AuthContext } from "../../../hooks/useAuth";
import { useCities } from "../../../hooks/useCities";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import { useStates } from "../../../hooks/useStates";
import { getAgeOfMajority } from "../../../utils/functionUtils";

const Form = ({onError = ()=>{}, onSuccess = ()=>{}, loadingData, serverComponents, fieldErrors, callAlert}) =>
{
    const {cities, cityList} = useCities();
    const {states} = useStates();
    const {personTypes} = serverComponents;

    const [birthDateTemp, setBirthDateTemp] = useState(null);
    const [userData, setUserData] = useState({}); 
    const [errorProfile, setErrorProfile] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const {buildAuthHeader} = useContext(AuthContext);
    const {getResponseHandled} = useHandleResponseError();

    const {
        register, watch, handleSubmit, 
        setError, control, 
        errors, clearErrors, reset
    } = useForm({resolver: registerForm()});

    const onChangeState = (stateId) =>
    {
        cityList(stateId);
    }

    // SET MANUAL ERRORS TO REACT-HOOK-FORM
    useEffect(()=>
    {
        for(const error in fieldErrors)
        {
            setError(error, {message: fieldErrors[error]});
        }
    }, 
    [fieldErrors, setError]);

    //EXECUTES WHEN USER-DATA IS LOADED
    useEffect(()=>
    {
        // LOADS INITIAL FORM DATA
        if(userData.id !== undefined)
        {
            reset({...userData, cityId: undefined, birthDate: undefined});
            const birthDate = moment(userData.birthDate, true, DATE_FORMAT);
            setBirthDateTemp(birthDate);
            cityList(userData.stateId);
        }
    }, 
    [userData, cityList, reset]);

    useEffect(() =>
    {
        // UPDATES INITIAL FORM DATA WITH CITY
        if(cities.length > 0 && cities[0].id !== 0 && !initialized)
        {
            reset({...userData, birthDate: undefined});
            setInitialized(true);
        }
    },
    [cities, userData, initialized, reset]);

    useEffect(()=>
    {
        const source = axios.CancelToken.source();

        const getProfileData = async () =>
        {
            try
            {
                const {data} = await axios.get(`${API_ENDPOINT}/user/profile`, {...buildAuthHeader(), cancelToken: source.token});
                setUserData({...data, hasData: true});
            }
            catch(error)
            {
                if(!axios.isCancel(error))
                {
                    setErrorProfile(true);

                    const {alertError} = getResponseHandled(error);
                    callAlert(alertError);
                }
            }
        };
        states.length > 0 && getProfileData();
        
        return () => source.cancel();
    },
    [states, getResponseHandled, buildAuthHeader, callAlert]);

    useEffect(() => 
    {
        onError(errors);
    }, 
    [errors, onError])
    
    const backdropStyle = {
        zIndex: 101, 
        position: "absolute", 
        flexDirection: "column",
        background: "transparent", 
        borderRadius: "8px",
        padding: "12px",
    }

    return(
        <form autoComplete="off" onSubmit={handleSubmit(onSuccess)}>
            <Backdrop open={!errorProfile && !userData.hasData} style={backdropStyle}>
                <CircularProgress />
                <span>Carregando...</span>
            </Backdrop>

            <Grid container spacing={1}>

                <Grid item xs={8}>
                    <Input 
                        placeholder="Nome Completo"
                        name="name"  
                        refForm={register} 
                        title={errors.name?.message}
                        className={errors.name && "input-error"}
                        disabled={!userData.hasData}
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
                        disabled={!userData.hasData}
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
                        disabled={!userData.hasData}
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
                        disabled={!userData.hasData}
                        
                    />
                </Grid>

                <Grid item xs={12}>
                    <Input 
                        placeholder="E-mail"   
                        name="email"
                        refForm={register}  
                        title={errors.email?.message}
                        className={errors.email && "input-error"}
                        disabled={!userData.hasData}
                    />
                </Grid>

                <Grid item xs={4}>
                    <Select
                        placeholder="Estado"
                        valueName="id"
                        labelName="sigla"
                        name="stateId"
                        onChange={e => onChangeState(e.target.value)}
                        data={states}
                        refForm={register}
                        title={errors.stateId?.message}
                        className={errors.stateId && "input-error"}
                        disabled={!userData.hasData}
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
                        disabled={!userData.hasData}
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
                        disabled={!userData.hasData}
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
                        disabled={!userData.hasData}
                    />
                </Grid>
                
            </Grid>
            <Button
                value="Realizar Alterações"
                loading={loadingData || !userData.hasData}
                onClick={() => clearErrors()}
            />
        </form>
    );
}

export default Form;