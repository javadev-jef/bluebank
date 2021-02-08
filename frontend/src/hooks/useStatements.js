import { useCallback, useContext, useState } from "react";
import axios from "axios";
import {API_ENDPOINT} from "../constants/constants";
import { useEffect } from "react";
import { AuthContext } from "./useAuth";
import { useHandleResponseError } from "./useHandleResponseError";

export const useStatements = (setAlertMessage) =>
{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allDebits, setAllDebits] = useState(0);
    const [allCredits, setAllCredits] = useState(0);
    const [balance, setBalance] = useState(0);
    const {buildAuthHeader} = useContext(AuthContext);
    const {getResponseHandled} = useHandleResponseError();
    const [inputErrors, setInputErrors] = useState([]);

    useEffect(()=>
    {
        setAllDebits(data.reduce(calculateDebits, 0));
        setAllCredits(data.reduce(calculateCredits, 0));
    }, 
    [data]);

    const fetch = useCallback(async (formData) =>
    {
        setLoading(true);

        try
        {  
            setData([{}]);
            const {data} = await axios.post(`${API_ENDPOINT}/user/account/statement`, formData, buildAuthHeader());
            setData(data.movements);
            setBalance(data.balance);

            setLoading(false);
            setAlertMessage({type: "info", value: "Busca realizada com sucesso!", open: true});
        }
        catch(error)
        {
            setData([]);
            const {alertError, fieldErrors} = getResponseHandled(error);
            setAlertMessage(alertError);
            setInputErrors(fieldErrors);
            setLoading(false);
        }
    }, 
    [buildAuthHeader, setAlertMessage, getResponseHandled]);

    const calculateDebits = (total, data) =>
    {
        return data.finalAmount < 0 ? total + data.finalAmount : total;
    } 

    const calculateCredits = (total, data) =>
    {
        return data.finalAmount > 0 ? total + data.finalAmount : total;
    } 

    const clearStatement = useCallback(() =>
    {
        setData([]);
        setBalance(0)
    }, []);

    return {data, fetch, loading, allDebits, allCredits, balance, clearStatement, inputErrors};
}