import React, { useCallback, useState } from "react";

import Navbar from "../../components/Navbar";

import "./style.scss";

import Form from "./Form";
import { Dialog } from "@material-ui/core";
import BlueCoin from "./BlueCoin";
import AlertMessage from "../../components/AlertMessage";

import saqueImg from "../../assets/withdraw_money.svg";
import { API_ENDPOINT } from "../../constants/constants";

import axios from "axios";
import { useDefaultResponseServer } from "../../hooks/useDefaultResponseServer";


const Withdraw = () =>
{
    const [data, setData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clearForm, setClearForm] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [alertProps, setAlertProps] = useState({open: false});
    const {serverComponents} = useDefaultResponseServer(setAlertProps);

    const onSuccessForm = async (data) =>
    {
        try
        {
            setLoading(true);
            const response = await axios.post(`${API_ENDPOINT}/user/withdraw`, data, {responseType: 'arraybuffer'});
            
            setData(data);
            setQrCode(new Buffer(response.data, "binary").toString("base64"));

            setAlertProps({type: "success", message: "Saque realizado com sucesso.", open: true});
            setClearForm(true); setOpenDialog(true);
        }
        catch(error)
        {
            const response = error.response;
            const data = response && JSON.parse(Buffer.from(response.data).toString('utf8'));
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

    const onErrorForm = useCallback((errors)=>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
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
                    errorServer={errors}
                    serverComponents={serverComponents}
                    clearForm={clearForm}
                />

                <Dialog 
                    maxWidth={"lg"}
                    open={openDialog && data.cashType === "BLUECOIN"} 
                    PaperProps={{style: {backgroundColor: "transparent"}}}
                >
                    <BlueCoin 
                        onClose={()=> setOpenDialog(false)}
                        data={data}
                        qrcode={qrCode}
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