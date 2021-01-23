import React, { useEffect, useRef } from "react";
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

const Deposit = () =>
{
    const [logged, setLogged] = useState(false);
    const [alertProps, setAlertProps] = useState({open: false});
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [data, setData] = useState([]);
    const reciboRef = useRef();
    const [serverComponents, setServerComponents] = useState([]);
    const [clearForm, setClearForm] = useState(false);
    const [errors, setErrors] = useState([]);

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
            const response = await axios.post(`${API_ENDPOINT}/user/account/deposit`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
            
            setData(response.data);

            setAlertProps({type: "success", message: "Deposito realizado com sucesso.", open: true});
            setClearForm(true); setOpenDialog(true);
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
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
            console.log(errors);
        }
    }, []);

    useState(() =>
    {
        const getDefaultStatusServer = async () =>
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

        getDefaultStatusServer();
    }, []);

    useEffect(()=>
    {
        setLogged(true);
    },[])

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
                    errorServer={errors}
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

export default Deposit;