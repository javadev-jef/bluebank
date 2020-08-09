import React, { useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";

import "./style.scss";
import depositImg from "../../assets/deposit_money.svg";
import { useState } from "react";
import Form from "./Form";
import AlertMessage from "../../components/AlertMessage";
import { useCallback } from "react";
import { Dialog } from "@material-ui/core";
import Receipt from "./Receipt";
import { useReactToPrint } from 'react-to-print';

const Deposit = () =>
{
    const [logged, setLogged] = useState(false);
    const [alertProps, setAlertProps] = useState({open: false});
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [data, setData] = useState([]);
    const reciboRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => reciboRef.current,
        documentTitle: "BlueBank - Recibo",
    });

    const onFormSuccess = (data) =>
    {
        console.log(data);
        setData(data);
        setLoading(true)
        setTimeout(()=>
        {
            setAlertProps({type: "success", message: "Deposito realizado com sucesso.", open: true});
            setLoading(false);
            setOpenDialog(true);
        }, 
        2000);
    }

    const onFormError = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
            console.log(errors);
        }
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

                    {!logged &&
                    <h1 className="logo">
                        <span className="part-01">Blue</span>
                        <span className="part-02">Bank</span>
                    </h1>}

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