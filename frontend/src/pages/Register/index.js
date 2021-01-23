import React, { useCallback, useEffect, useState } from "react";

import "./style.scss";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Form from "./Form";
import { API_ENDPOINT } from "../../constants/constants";
import axios from "axios";
import AlertMessage from "../../components/AlertMessage";
import Logo from "../../components/Logo";

export default function Register()
{
    const [alertProps, setAlertProps] = useState({open: false});
    const [loading, setLoading] = useState(false);
    const [serverComponents, setServerComponents] = useState([]);
    const [errors, setErrors] = useState([]);
    const [clearForm, setClearForm] = useState(false);
    const history = useHistory();

    const onErrorForm = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
            console.log(errors);
        }
    }, []);

    const onSuccessForm = async (data) =>
    {
        console.log(data);
        try
        {
            setLoading(true);
            await axios.post(`${API_ENDPOINT}/user/register`, data);
            setClearForm(true);
            setAlertProps({type: "success", message: "Cadastro realizado com sucesso!", open: true});
            setTimeout(() => history.push("/"), 4000);
        }
        catch(error)
        {
            const response = error.response;
            const data = response && response.data;
            const errors = response && data.errors;
            const message = response && data.message;

            if(response && errors && response.status === 400)
            {
                setErrors(errors);
                setAlertProps({type: "error", message: "Ops! Os dados não foram preenchidos corretamente.", open: true});
            }
            else if(response && message)
            {
                setAlertProps({type: "error", message: message, open: true});
            }
            else{
                setAlertProps({type: "error", message: "Falha na tentativa de conexão com servidor.", open: true});
            }
            console.log(error);
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(()=>
    {
        /**
         * GET A DEFAULT RESPONSE FOR ANY PAGES
         */
        const getDefaultResponseServer = async () =>
        {
            try
            {
                const response = await axios.get(`${API_ENDPOINT}/default-response`);
                setServerComponents(response.data);
            }
            catch(error)
            {
                if(!error.response)
                {
                    setAlertProps({type: "error", message: "Erro na tentativa de conexão com o servidor.", open: true});
                }
            }
        };

        getDefaultResponseServer();
    }, []);

    return(
        <div className="register-container">
            <div className="content">
                <section>
                    <Logo toPage="#"/>
                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro sem burocracia.</p>
                    <p>Somos o único banco a oferecer uma conta corrente e poupança 100% digital e gratuita.</p>
                    <Link className="link-to" to="/"><FiArrowLeft />Já possuo uma conta</Link>
                </section>

                <Form 
                    loadingData={loading}
                    onSuccess={onSuccessForm}
                    onError={onErrorForm}
                    errorServer={errors}
                    serverComponents={serverComponents}
                    clearForm={clearForm}
                />
            </div>

            <AlertMessage 
                maxWidth={450} 
                open={alertProps.open}
                autoHideDuration={8000} 
                severity={alertProps.type}
                message={alertProps.message}
                anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                onClose={() => setAlertProps({...alertProps, open: false})}
            />
        </div>
    );
}