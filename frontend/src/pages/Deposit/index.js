import React, { useContext, useEffect, useRef } from "react";
import { useState, useCallback } from "react";

import Navbar from "../../components/Navbar";
import AlertMessage from "../../components/AlertMessage";
import { Dialog } from "@material-ui/core";
import Receipt from "./Receipt";
import Form from "./Form";

import "./style.scss";

import depositImg from "../../assets/deposit_money.svg";

import { useReactToPrint } from 'react-to-print';
import { API_ENDPOINT } from "../../constants/constants";
import axios from "axios";
import {serialize} from "object-to-formdata";
import Logo from "../../components/Logo";
import { useDefaultResponseServer } from "../../hooks/useDefaultResponseServer";
import { AuthContext } from "../../hooks/useAuth";
import { useHandleResponseError, DisconnectType } from "../../hooks/useHandleResponseError";

const Deposit = () =>
{
    const [logged, setLogged] = useState(false);
    const [alertMessage, setAlertMessage] = useState({open: false});
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [data, setData] = useState([]);
    const reciboRef = useRef();
    const [clearForm, setClearForm] = useState(false);
    const [inputErrors, setInputErrors] = useState([]);
    const {serverComponents} = useDefaultResponseServer(setAlertMessage);
    const {credentials} = useContext(AuthContext);
    const {getResponseHandled} = useHandleResponseError();

    const handlePrint = useReactToPrint
    ({
        content: () => reciboRef.current,
        documentTitle: "BlueBank - Recibo",
    });

    const onFormSuccess = async (data) =>
    {
        const finalFile = data.cashType === "BLUECOIN" ? data.bluecoinFile[0] : undefined;
        const formData = serialize({...data, bluecoinFile: finalFile});

        try
        {
            setLoading(true);
            const {data} = await axios.post(`${API_ENDPOINT}/user/account/deposit`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            
            setData(data);

            setAlertMessage({type: "success", value: "Deposito realizado com sucesso.", open: true});
            setClearForm(true); setOpenDialog(true);
        }
        catch(error)
        {
            if(!axios.isCancel(error))
            {
                const {alertError, fieldErrors} = getResponseHandled(error, DisconnectType.ONLY_DISCONNECT);
                setAlertMessage(alertError);
                setInputErrors(fieldErrors);
            }
        }
        finally
        {
            setLoading(false);
            setClearForm(false);
        }
    }

    const onFormError = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertMessage({type: "error", value: "Todos os campos em destaque são obrigatórios.", open: true});
        }
    }, []);

    useEffect(()=>
    {
        setLogged(!!credentials.token);
    },
    [credentials.token])

    return(
        <div className="deposit-container" style={!logged ? {display: "flex"} : {}}>

            {logged && <Navbar />}

            <main className={!logged ? "content" : {}}>
                <section>

                    {!logged && <Logo toPage="#"/>}

                    <h2>Depósito Bancário</h2>
                    <p>Depositos realizados após 18h00 serão compensados somente no próximo dia.</p>
                    
                    {logged &&
                    <ol>
                        <li>Tenha praticidade ao realizar o seu depósito</li>
                        <li>Receba seu comprovante de depósito na mesma hora</li>
                    </ol>
                    }

                    <img src={depositImg} alt="Deposit Money"/>
                </section>

                <Form 
                    loadingData={loading}
                    isUserLogged={logged}
                    onError={onFormError}
                    onSuccess={onFormSuccess}
                    fieldErrors={inputErrors}
                    serverComponents={serverComponents}
                    clearForm={clearForm}
                />

                <Dialog 
                    open={openDialog} 
                    maxWidth={"lg"}
                    PaperProps={{style: {backgroundColor: "transparent"}}}>

                    <Receipt 
                        onClose={() => setOpenDialog(false)}
                        ref={reciboRef}
                        onPrint={handlePrint}
                        data={data}
                        serverComponents={serverComponents}
                    />
                </Dialog>
                
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

export default Deposit;