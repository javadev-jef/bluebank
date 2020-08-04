import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";

import "./style.scss";
import StatementListTable from "../../components/StatementListTable";
import { useStatements } from "../../hooks/useStatements";
import { CircularProgress } from "@material-ui/core";
import {formatCurrencyValue} from "../../utils/functionUtils";
import AlertMessage from "../../components/AlertMessage";
import StatementForm from "../../components/StatementForm";


export default function Statement()
{
    const statements = useStatements();
    const [alertProps, setAlertProps] = useState({open: false});

    const progressStyle = {
        marginLeft: 4,
        marginBottom: -1,
        display: !statements.loading && "none"
    }
    
    const onFormSuccess = (data) =>
    {
        console.log(data);
        statements.fetch();
    }

    const onErrorForm = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
            console.log(errors);
        }
    }, []);

    useEffect(() =>
    {
        const response = statements.response;
        response.msg != null && setAlertProps({type: response.type, message: response.msg, open: true});
    }, 
    [statements.response])

    return(
        <div className="statement-container">
            <Navbar />
            <main>
                <fieldset>
                    <legend>Resumo</legend>
                    <div className="span-group">
                        <span>1234</span>
                        <span>Conta Corrente</span>
                    </div>
                    <div className="span-group">
                        <span style={{color: "green"}}>R$ 1.500,26</span>
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

                <StatementForm onSuccess={onFormSuccess} onError={onErrorForm} loading={statements.loading}/>

                <StatementListTable statements={statements}/>
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