import React, { useCallback, useContext, useState } from "react";

import "./style.scss";
import { Link, Redirect, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Form from "./Form";
import { API_ENDPOINT } from "../../constants/constants";
import axios from "axios";
import AlertMessage from "../../components/AlertMessage";
import Logo from "../../components/Logo";
import { useDefaultResponseServer } from "../../hooks/useDefaultResponseServer";
import { useHandleResponseError } from "../../hooks/useHandleResponseError";
import {routes} from "../../constants/paths.json";
import { AuthContext } from "../../hooks/useAuth";

export default function Register()
{
    const auth = useContext(AuthContext);
    const [alertMessage, setAlertMessage] = useState({open: false});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [clearForm, setClearForm] = useState(false);
    const history = useHistory();
    const {serverComponents} = useDefaultResponseServer(setAlertMessage);
    const {getResponseHandled} = useHandleResponseError();

    const onErrorForm = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertMessage({type: "error", value: "Todos os campos em destaque são obrigatórios.", open: true});
        }
    }, []);

    const onSuccessForm = async (data) =>
    {
        try
        {
            setLoading(true);
            await axios.post(`${API_ENDPOINT}/user/register`, data);
            setClearForm(true);
            setAlertMessage({type: "success", value: "Cadastro realizado com sucesso!", open: true});
            setTimeout(() => history.push(routes.logon), 6000);
        }
        catch(error)
        {
            const {alertError, fieldErrors} = getResponseHandled(error);
            setErrors(fieldErrors);
            setAlertMessage(alertError);
        }
        finally
        {
            setLoading(false);
        }
    }

    if(auth.isAuthenticated() && !auth.isTokenExpired())
    {
        return <Redirect to={{pathname: routes.home}}/>
    }

    return(
        <div className="register-container">
            <div className="content">
                <section>
                    <Logo toPage="#"/>
                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro sem burocracia.</p>
                    <p>Somos o único banco a oferecer uma conta corrente e poupança 100% digital e gratuita.</p>
                    <Link className="link-to" to={routes.logon}><FiArrowLeft />Já possuo uma conta</Link>
                </section>

                <Form 
                    loadingData={loading}
                    onSuccess={onSuccessForm}
                    onError={onErrorForm}
                    fieldErrors={errors}
                    clearForm={clearForm}
                    serverComponents={serverComponents}
                />
            </div>

            <AlertMessage 
                maxWidth={450} 
                open={alertMessage.open}
                autoHideDuration={8000} 
                severity={alertMessage.type}
                message={alertMessage.value}
                anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                onClose={() => setAlertMessage({...alertMessage, open: false})}
            />
        </div>
    );
}