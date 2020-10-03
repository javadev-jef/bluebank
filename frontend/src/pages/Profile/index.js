import React, { useEffect, useState, useCallback } from "react";

import { Link } from "react-router-dom";

import { FiArrowLeft } from "react-icons/fi";

import Form from "./Form";
import AlertMessage from "../../components/AlertMessage";

import { API_ENDPOINT } from "../../constants/constants";

import "./style.scss";

import axios from "axios";

const Profile = () =>
{
    const [alertProps, setAlertProps] = useState({open: false});
    const [loading, setLoading] = useState(false);
    const [serverComponents, setServerComponents] = useState([]);
    const [errors, setErrors] = useState([]);
    
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
        try
        {
            setLoading(true);
            await axios.put(`${API_ENDPOINT}/user/profile/update`, data);
            
            setAlertProps({type: "success", message: "Dados alterados com sucesso!", open: true});
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
        <div className="profile-container">
            <main>
                <section>
                    <h1 className="logo">
                        <span className="part-01">Blue</span>
                        <span className="part-02">Bank</span>
                    </h1>
                    <h2>Meus Dados</h2>
                    <p>Beneficios em manter seu cadastro atualizado:</p>
                    <ol>
                        <li>Facilidade na comunicação.</li>
                        <li>Redução de erros na comunicação.</li>
                        <li>Informações sempre corretas, e atuais.</li>
                    </ol>
                    <Link className="link-to" to="/home"><FiArrowLeft />Voltar para home</Link>
                </section>
                <Form 
                    loadingData={loading}
                    onError={onErrorForm} 
                    onSuccess={onSuccessForm}
                    serverComponents={serverComponents}
                    errorServer={errors}
                />
            </main>

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

export default Profile;