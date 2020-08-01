import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import "./style.scss";
import transferImg from "../../assets/transfer_money.svg";
import TransferForm from "../../components/TransferForm";
import AlertMessage from "../../components/AlertMessage";

export default function Transfer()
{

    const [alertProps, setAlertProps] = useState({open: false});
    const [loading, setLoading] = useState(false);
    const [clearForm, setClearForm] = useState(false);
    const [defaultValuesForm, setDefaultValuesForm] = useState({});

    const onFormError = useCallback((errors) =>
    {
        if(Object.entries(errors).length > 0)
        {
            setAlertProps({type: "error", message: "Todos os campos em destaque são obrigatórios.", open: true});
            console.log(errors);
        }
    }, []);

    const onFormSuccess = (data) =>
    {
        console.log(data);
        setLoading(true);

        setTimeout(() => 
        {
            setLoading(false)
            setAlertProps({type: "success", message: "Transferência realizada com sucesso.", open: true});
            setClearForm(true);
        }, 2000)
    }

    useEffect(() => 
    {
        setDefaultValuesForm({balance: 1500})

    }, []);

    return(
        <div className="transfer-container">
            <Navbar />
            <main>

                <section>
                    <h2>Transferência</h2>
                    <p>No Blue Bank você consegue fazer transferências com facilidade. Confira a baixo como é simples:</p>
                    <ol>
                        <li>Preencha seus dados, informando a conta (Origem)</li>
                        <li>Inclua os dados do favorecido (Destino)</li>
                        <li>Selecione a data em que desejar realizar a transferência</li>
                        <li>Confira os dados, e clique em transferir</li>
                    </ol>
                    <img src={transferImg} alt="Transfer Money"/>
                </section>

                <TransferForm 
                    onError={onFormError} 
                    onSuccess={onFormSuccess} 
                    loadingData={loading}
                    clearForm={clearForm}
                    defaultValues={defaultValuesForm}
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