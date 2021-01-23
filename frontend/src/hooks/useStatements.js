import { useState } from "react";
import axios from "axios";
import {API_ENDPOINT} from "../constants/constants";
import { useEffect } from "react";

export const useStatements = () =>
{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({});
    const [allDebits, setAllDebits] = useState(0);
    const [allCredits, setAllCredits] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(()=>
    {
        setAllDebits(data.reduce(calculateDebits, 0));
        setAllCredits(data.reduce(calculateCredits, 0));
    }, 
    [data]);

    const fetch = async (formData) =>
    {
        try
        {
            setData([{}]);
            setLoading(true);
            setResponse({type: null, msg: null, loading: true});

            const response = await axios.post(`${API_ENDPOINT}/statement`, formData);
            setData(response.data.movements);
            setBalance(response.data.balance);

            //setLoading(false);
            setResponse({type: "info", msg: "Busca realizada com sucesso!", loading: false});
        }
        catch(error)
        {
            setData([]);
            setResponse({type: "error", msg: "Erro ao buscar dados do servidor.", loading: false});
        }
        finally{
            setLoading(false);
        }
    }

    const calculateDebits = (total, data) =>
    {
        return data.finalAmount < 0 ? total + data.finalAmount : total;
    } 

    const calculateCredits = (total, data) =>
    {
        return data.finalAmount > 0 ? total + data.finalAmount : total;
    } 

    const clearStatement = () =>
    {
        setData([]);
        setBalance(0)
    }

    return {data, fetch, loading, allDebits, allCredits, response, balance, clearStatement};
}