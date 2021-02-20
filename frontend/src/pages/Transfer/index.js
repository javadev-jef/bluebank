import React, { useState, useCallback, useContext } from "react";

import Navbar from "../../components/Navbar";
import AlertMessage from "../../components/AlertMessage";
import Form from "./Form";

import transferImg from "../../assets/transfer_money.svg";

import { API_ENDPOINT } from "../../constants/constants";
import { isFutureDate } from "../../utils/functionUtils";

import axios from "axios";
import "./style.scss";
import { useDefaultResponseServer } from "../../hooks/useDefaultResponseServer";
import { AuthContext } from "../../hooks/useAuth";
import { useHandleResponseError } from "../../hooks/useHandleResponseError";

export default function Transfer()
{
    const [inputErrors, setInputErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clearForm, setClearForm] = useState(false);
    const [alertMessage, setAlertMessage] = useState({open: false});
    const {serverComponents} = useDefaultResponseServer(setAlertMessage);
    const {buildAuthHeader} = useContext(AuthContext);
    const {getResponseHandled} = useHandleResponseError();

    const onFormError = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertMessage({type: "error", value: "Todos os campos em destaque são obrigatórios.", open: true});
        }
    }, []);

    const onFormSuccess = async (data) =>
    {
        setLoading(true);

        try
        {
	        await axios.post(`${API_ENDPOINT}/user/account/transfer`, data, buildAuthHeader());
            setAlertMessage({type: "success", value: `Transferência ${isFutureDate(data.whenToDo) ? 'agendada' : 'realizada'} com sucesso.`, open: true});
            setClearForm(true);
        }
        catch(error)
        {
            const {alertError, fieldErrors} = getResponseHandled(error);
            setAlertMessage(alertError);
            setInputErrors(fieldErrors);
        }
        finally
        {
            setClearForm(false)
            setLoading(false);
        }
    }

    return(
        <div className="transfer-container">
            <Navbar />
            <main>

                <section>
                    <h2>Transferência</h2>
                    <p>No Blue Bank você consegue fazer transferências com facilidade. Confira a baixo como é simples:</p>
                    <ol>
                        <li>Preencha seus dados, informando a conta (Origem).</li>
                        <li>Inclua os dados do favorecido (Destino).</li>
                        <li>Selecione a data em que desejar realizar a transferência.</li>
                        <li>Confira os dados, e clique em transferir.</li>
                    </ol>
                    <img src={transferImg} alt="Transfer Money"/>
                </section>

                <Form 
                    fieldErrors={inputErrors}
                    onError={onFormError} 
                    onSuccess={onFormSuccess} 
                    loadingData={loading}
                    clearForm={clearForm}
                    serverComponents={serverComponents}
                />

            </main>

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