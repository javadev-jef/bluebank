import React, { useState, useEffect, useCallback } from "react";

import Navbar from "../../components/Navbar";
import AlertMessage from "../../components/AlertMessage";
import Form from "./Form";

import transferImg from "../../assets/transfer_money.svg";

import { API_ENDPOINT } from "../../constants/constants";
import { isFutureDate } from "../../utils/functionUtils";

import axios from "axios";
import "./style.scss";

export default function Transfer()
{
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clearForm, setClearForm] = useState(false);
    const [alertProps, setAlertProps] = useState({open: false});
    const [serverComponents, setServerComponents] = useState([]);

    const onFormError = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
        }
    }, []);

    const onFormSuccess = async (data) =>
    {
        setLoading(true);

        try
        {
	        await axios.post(`${API_ENDPOINT}/user/transfer`, data);
            setAlertProps({type: "success", message: `Transferência ${isFutureDate(data.whenToDo) ? 'agendada' : 'realizada'} com sucesso.`, open: true});
            setClearForm(true);
        }
        catch(error)
        {
            const response = error.response
            const errors = response && response.data.errors;
            const message = response && response.data.message;

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

            console.log(error.response)
        }
        finally
        {
            setClearForm(false)
            setLoading(false);
        }
    }

    useEffect(()=>
    {
        /**
         * A default server response for any pages
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
        <div className="transfer-container">
            <Navbar />
            <main>

                <section>
                    <h2>Transferência</h2>
                    <p>No Blue Bank você consegue fazer transferências com facilidade. Confira a baixo como é simples:</p>
                    <ol>
                        <li>Preencha seus dados, informando a conta (Origem)</li>
                        <li>Inclua os dados do favorecido (Destino)</li>
                        <li>Selecione a data em que desejar realizar a transferência</li>
                        <li>Confira os dados, e clique em transferir</li>
                    </ol>
                    <img src={transferImg} alt="Transfer Money"/>
                </section>

                <Form 
                    errorServer={errors}
                    onError={onFormError} 
                    onSuccess={onFormSuccess} 
                    loadingData={loading}
                    clearForm={clearForm}
                    serverComponents={serverComponents}
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