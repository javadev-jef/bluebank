import React, { useState } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Form from "./Form";
import AlertMessage from "../../components/AlertMessage";
import { useCallback } from "react";

const Profile = () =>
{
    const [alertProps, setAlertProps] = useState({open: false});
    const [loading, setLoading] = useState(false);
    
    const onErrorForm = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
            console.log(errors);
        }
    }, []);

    const onSuccessForm = (data) =>
    {
        setLoading(true)
        setTimeout(() =>
        {
            console.log(data);
            setLoading(false);
            setAlertProps({type: "success", message: "Cadastro atualizado com sucesso.", open: true});
        }, 2000)
    }

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