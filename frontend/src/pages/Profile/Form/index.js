import React, { useEffect, useState } from "react";

import { Grid, CircularProgress, Backdrop } from "@material-ui/core";
import Input from "../../../components/Input";
import DatePicker from "../../../components/DatePicker";
import Select from "../../../components/Select";

import { useForm } from "react-hook-form";
import { useStates } from "../../../hooks/useStates";
import { useCities } from "../../../hooks/useCities";
import { registerForm } from "../../../constants/formSchema";

import { getAgeOfMajority } from "../../../utils/functionUtils";
import { API_ENDPOINT, DATE_FORMAT } from "../../../constants/constants";

import axios from "axios";
import moment from "moment";

const Form = ({onError = ()=>{}, onSuccess = ()=>{}, loadingData, serverComponents, errorServer}) =>
{
    const {cities, cityList} = useCities();
    const {states} = useStates();
    const {personTypes} = serverComponents;

    const [birthDateTemp, setBirthDateTemp] = useState(null);
    const [userData, setUserData] = useState({}); 
    const [errorProfile, setErrorProfile] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const {register, watch, handleSubmit, setError, errors, clearErrors, reset} = useForm({resolver: registerForm()});

    const onChangeState = (stateId) =>
    {
        cityList(stateId);
    }

    // SET MANUAL ERRORS TO REACT-HOOK-FORM
    useEffect(()=>
    {
        for(const error in errorServer)
        {
            setError(error, {message: errorServer[error]});
        }
    }, 
    [errorServer, setError]);

    //EXECUTES WHEN USER-DATA IS LOADED
    useEffect(()=>
    {
        // LOADS INITIAL FORM DATA
        if(userData.id !== undefined)
        {
            reset({...userData, cityId: undefined, birthDate: null});
            cityList(userData.stateId);
        }
    }, 
    [userData, cityList, reset]);

    useEffect(() =>
    {
        // UPDATES INITIAL FORM DATA WITH CITY
        if(cities.length > 0 && cities[0].id !== 0 && !initialized)
        {
            const birthDate = moment(userData.birthDate, true, DATE_FORMAT);
            reset({...userData, birthDate: birthDate});
            setBirthDateTemp(birthDate);
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
                const response = await axios.get(`${API_ENDPOINT}/user/profile`, {cancelToken: source.token});
                const data = response.data;

                setUserData({...data, hasData: true});
            }
            catch(error)
            {
                if(!axios.isCancel(error))
                {
                    setErrorProfile(true);
                    console.log(error);
                }
            }
        };
        states.length > 0 && getProfileData();
        
        return () => source.cancel();
    },
    [states]);

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
                    <Input 
                        placeholder={watch("personType") ? watch("personType") : "CPF/CNPJ"}
                        name="cpfCnpj"   
                        refForm={register} 
                        title={errors.cpfCnpj?.message}
                        className={errors.cpfCnpj && "input-error"}
                        disabled={!userData.hasData}
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
            <button 
                type="submit"
                className="button" 
                onClick={() => clearErrors()} 
                disabled={loadingData || !userData.hasData} 
            >
                {loadingData ? <CircularProgress style={{color: "#FFF"}}/> : "Realizar Alterações"}
            </button>
        </form>
    );
}

export default Form;