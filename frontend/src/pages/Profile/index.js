import axios from "axios";
import React, { useCallback, useContext, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import Logo from "../../components/Logo";
import { API_ENDPOINT } from "../../constants/constants";
import { AuthContext } from "../../hooks/useAuth";
import { useDefaultResponseServer } from "../../hooks/useDefaultResponseServer";
import {routes} from "../../constants/paths.json";
import Form from "./Form";
import "./style.scss";
import { useHandleResponseError } from "../../hooks/useHandleResponseError";

const Profile = () =>
{
    const [alertMessage, setAlertMessage] = useState({open: false});
    const [loading, setLoading] = useState(false);
    const [inputErrors, setInputErrors] = useState([]);
    const {serverComponents} = useDefaultResponseServer(setAlertMessage);
    const {buildAuthHeader, requestLogout} = useContext(AuthContext);
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
            await axios.put(`${API_ENDPOINT}/user/profile/update`, data, buildAuthHeader());
            setLoading(false);
            
            const expiredSession = {type: "success", value: "Dados alterados com sucesso! Realize um novo login para continuar", open: true};
            requestLogout(expiredSession);
        }
        catch(error)
        {
            const {alertError, fieldErrors} = getResponseHandled(error);
            setAlertMessage(alertError);
            setInputErrors(fieldErrors);

            setLoading(false);
        }
    }

    return(
        <div className="profile-container">
            <main>
                <section>
                    <Logo toPage="#"/>
                    <h2>Meus Dados</h2>
                    <p>Beneficios em manter seu cadastro atualizado:</p>
                    <ol>
                        <li>Facilidade na comunicação.</li>
                        <li>Redução de erros na comunicação.</li>
                        <li>Informações sempre corretas, e atuais.</li>
                    </ol>
                    <Link className="link-to" to={routes.home}><FiArrowLeft />Voltar para home</Link>
                </section>
                <Form 
                    loadingData={loading}
                    onError={onErrorForm} 
                    onSuccess={onSuccessForm}
                    serverComponents={serverComponents}
                    fieldErrors={inputErrors}
                    callAlert={setAlertMessage}
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

export default Profile;