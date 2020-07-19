import { useState } from "react";

export const useStatements = () =>
{
    const [loading, setLoading] = useState(false);

    const dataTest = [
        {date: "17/07/2020 17:25", type: "Débito", description: "Transferência entre contas", value: "10000.00"},
        {date: "18/07/2020 13:00", type: "Crédito", description: "Transferência recebida de Carlos A Magno", value: 358.42},
        {date: "17/07/2020 00:20", type: "Débito", description: "Saque autorizado via senha eletronica", value: 2153.47},
        {date: "18/07/2020", type: "Crédito", description: "Deposito bancário", value: 150.20},
        {date: "17/07/2020", type: "Débito", description: "Transferência realizada para José Augusto", value: 120},
        {date: "18/07/2020", type: "Crédito", description: "Deposito online", value: 50},
        {date: "17/07/2020", type: "Débito", description: "Pagamento de cartão", value: 2153.47},
        {date: "18/07/2020", type: "Crédito", description: "Deposito bancário", value: 150.20},
        {date: "17/07/2020", type: "Débito", description: "Pagamento de cartão", value: 2153.47},
        {date: "18/07/2020", type: "Crédito", description: "Deposito bancário", value: 150.20},
        {date: "17/07/2020", type: "Débito", description: "Pagamento de cartão", value: 2153.47},
        {date: "18/07/2020", type: "Crédito", description: "Deposito bancário", value: 150.20},
        {date: "17/07/2020", type: "Débito", description: "Pagamento de cartão", value: 2153.47},
        {date: "18/07/2020", type: "Crédito", description: "Deposito bancário", value: 150.20},
        {date: "17/07/2020", type: "Débito", description: "Pagamento de cartão", value: 2153.47},
        {date: "18/07/2020", type: "Crédito", description: "Deposito bancário", value: 150.20},
        {date: "17/07/2020", type: "Débito", description: "Pagamento de cartão", value: 2153.47},
        {date: "18/07/2020", type: "Crédito", description: "Deposito bancário", value: 150.20}
    ];

    const [data, setData] = useState([]);

    // TODO: Buscar dados do banco.
    const fetch = () =>
    {
        try
        {
            setLoading(true);
            setTimeout(() =>{
                setData(dataTest);
                setLoading(false);
            }, 500);
        }
        catch(error)
        {
            console.log(error);
        }
    }

    return {data, fetch, loading};
}