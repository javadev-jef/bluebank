import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import cofrinhoImg from "../../assets/cofrinho.svg";
import AlertMessage from "../../components/AlertMessage";
import Logo from "../../components/Logo";
import { routes } from "../../constants/paths.json";
import { AuthContext } from "../../hooks/useAuth";
import { useDefaultResponseServer } from "../../hooks/useDefaultResponseServer";
import Form from "./Form";
import "./style.scss";

export default function Logon()
{
    const auth = useContext(AuthContext);
    const [alert, setAlert] = useState({});
    const {clearCredentials, clearStates} = auth;
    const {serverComponents} = useDefaultResponseServer(setAlert);
    const [currentPage, setCurrentPage] = useState();

    const onSuccessForm = (data) =>
    {
        setCurrentPage(routes.logon);
        auth.requestLogin(data);
    }

    useEffect(() =>
    {
        return () => clearStates();
    }, 
    [clearStates]);

    useEffect(() => 
    {
        setAlert(auth.alertMessage);
    },
    [auth.alertMessage]);

    useEffect(() =>
    {
        const lastSessionExpired = sessionStorage.getItem("expiredSession");

        if(lastSessionExpired != null)
        {
            clearCredentials();
            setAlert(JSON.parse(lastSessionExpired));
            sessionStorage.removeItem("expiredSession");
        }
    }, 
    [clearCredentials]);

    if(auth.isAuthenticated() && !auth.isTokenExpired())
    {
        return <Redirect to={{pathname: routes.home, state: {backPage: currentPage}}}/>
    }

    return(
        <div className="logon-container">
            <section className="form">
                <Logo toPage="#"/>
                <Form 
                    onSuccess={onSuccessForm}
                    loadingData={auth.processing}
                    fieldErrors={auth.fieldErrors}
                    serverComponents={serverComponents}
                />
            </section>

            <img className="logon-image" src={cofrinhoImg} alt="Blue Bank"/>

            <AlertMessage 
                maxWidth={450} 
                open={alert.open}
                autoHideDuration={6000} 
                severity={alert.type}
                message={alert.value}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                onClose={() => setAlert({...alert, open:false})}
            />
        </div>
    );
}