import { useState } from "react";

export const useStatements = () =>
{
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({});

    const dataTest = [
        {date: "17/07/2020 17:25", type: "Débito", description: "Transferência entre contas", value: 10000},
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
        {date: "18/07/2020", type: "Crédito", description: "Deposito bancário", value: 150.20},
    ];

    const [data, setData] = useState([]);
    const [allDebits, setAllDebits] = useState(0);
    const [allCredits, setAllCredits] = useState(0);

    // TODO: Buscar dados do banco.
    const fetch = () =>
    {
        setData([{}])
        try
        {
            setLoading(true);
            setResponse({type: null, msg: null, loading: true})
            setTimeout(() =>{
                setData(dataTest);
                setAllDebits(dataTest.reduce(calculateDebits, 0));
                setAllCredits(dataTest.reduce(calculateCredits, 0))
                setLoading(false);
                setResponse({type: "info", msg: "Busca realizada com sucesso!", loading: false});
            }, 2000);
        }
        catch(error)
        {
            console.log(error);
            setResponse({type: "error", msg: "Erro ao realizar busca. "+error, loading: false});
        }
    }

    const calculateDebits = (total, data) =>
    {
        return data.type === "Débito" ? total + data.value : total;
    } 

    const calculateCredits = (total, data) =>
    {
        return data.type === "Crédito" ? total + data.value : total;
    } 

    return {data, fetch, loading, allDebits, allCredits, response};
}