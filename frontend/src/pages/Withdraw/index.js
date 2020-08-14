import React, { useRef } from "react";
import Navbar from "../../components/Navbar";

import "./style.scss";
import Form from "./Form";
import saqueImg from "../../assets/withdraw_money.svg";
import { Dialog } from "@material-ui/core";
import BlueCoin from "./BlueCoin";
import { useState } from "react";
import { useCallback } from "react";
import AlertMessage from "../../components/AlertMessage";
import { useReactToPrint } from "react-to-print";

const Withdraw = () =>
{
    const blueCoinRef = useRef();
    const [alertProps, setAlertProps] = useState({open: false});
    const [openDialog, setOpenDialog] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => blueCoinRef.current,
        documentTitle: "BlueBank - Cédula de Saque",
    });

    const onSuccessForm = (data) =>
    {
        console.log(data);
        setData(data);
        setLoading(true)
        setTimeout(()=>
        {
            setAlertProps({type: "success", message: "Saque realizado com sucesso.", open: true});
            setLoading(false);
            setOpenDialog(true);
        }, 
        2000);
    }

    const onErrorForm = useCallback((errors)=>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
            console.log(errors);
        }
    },[]);

    return(
        <div className="withdraw-container">
            <Navbar />
            <main>
                <section>
                    <h2>Saque</h2>
                    <p>Saque seu <span style={{fontWeight: 600}}>BlueCoin</span> a qualquer momento. Confira a baixo como é simples:</p>
                    <ol>
                        <li>Preencha seus dados, informando a conta (Origem).</li>
                        <li>Inclua uma descrição caso deseje.</li>
                        <li>Informe o valor do saque, insira sua senha.</li>
                        <li>Verifique todos os dados, e clique em realizar saque.</li>
                    </ol>
                    <img src={saqueImg} alt="Transfer Money"/>
                </section>

                <Form 
                    onSuccess={onSuccessForm} 
                    onError={onErrorForm}
                    loadingData={loading}
                />

                <Dialog 
                    open={openDialog} 
                    maxWidth={"lg"}
                    PaperProps={{style: {backgroundColor: "transparent"}}}
                    >

                    <BlueCoin 
                        ref={blueCoinRef} 
                        onClose={()=> setOpenDialog(false)}
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

export default Withdraw;