import React, { useState, useEffect, useCallback } from "react";

import { useStatements } from "../../hooks/useStatements";

import Navbar from "../../components/Navbar";
import StatementListTable from "../../components/StatementListTable";
import { CircularProgress } from "@material-ui/core";
import AlertMessage from "../../components/AlertMessage";
import Form from "./Form";

import "./style.scss";

import {formatCurrencyValue} from "../../utils/functionUtils";

import { useDefaultResponseServer } from "../../hooks/useDefaultResponseServer";


export default function Statement()
{
    const [alertMessage, setAlertMessage] = useState({open: false});
    const statements = useStatements(setAlertMessage);
    const {clearStatement, fetch, inputErrors} = statements;
    const [currentAccount, setCurrentAccount] = useState("-");
    const {serverComponents} = useDefaultResponseServer(setAlertMessage);
    
    const onFormSuccess = useCallback((data) =>
    {
        fetch(data);
    },
    [fetch]);

    const onFormError = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertMessage({type: "error", value: "Todos os campos em destaque são obrigatórios.", open: true});
        }
    }, []);

    useEffect(()=>
    {
        clearStatement();
    },
    [currentAccount, clearStatement]);

    const progressStyle = {
        marginLeft: 4,
        marginBottom: -1,
        display: !statements.loading && "none"
    }

    return(
        <div className="statement-container">
            <Navbar />
            <main>
                <fieldset>
                    <legend>Resumo</legend>

                    <div className="span-group">
                        <span>{currentAccount}</span>
                        <span>Nº Conta</span>
                    </div>

                    <div className="span-group">
                        <span style={{color: "green"}}>
                            {formatCurrencyValue(statements.balance)}
                        </span>
                        <span>Saldo Atual</span>
                    </div>

                    <div className="span-group">
                        <span style={{color: "red"}}>
                            {formatCurrencyValue(statements.allDebits)}
                            <CircularProgress size={14} style={progressStyle}/></span>
                        <span>Débitos por periodo</span>
                    </div>

                    <div className="span-group">
                        <span style={{color: "blue"}}>
                            {formatCurrencyValue(statements.allCredits)}
                            <CircularProgress size={14} style={progressStyle}/>
                        </span>
                        <span>Créditos por periodo</span>
                    </div>

                </fieldset>

                <Form 
                    onSuccess={onFormSuccess} 
                    onError={onFormError} 
                    loading={statements.loading}
                    onChangeAccount={setCurrentAccount}
                    serverComponents={serverComponents}
                    fieldErrors={inputErrors}
                />

                <StatementListTable statements={statements}/>
            </main>
            
            <AlertMessage
                maxWidth={450}
                open={alertMessage.open}
                autoHideDuration={8000} 
                severity={alertMessage.type}
                message={alertMessage.value}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                onClose={() => setAlertMessage({...alertMessage, open: false})}
            />
        </div>
    );
}