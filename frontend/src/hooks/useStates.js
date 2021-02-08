import { useEffect, useState } from "react";
import axios from "axios";
import {IBGE_ESTADOS} from "../constants/constants.js";


export const useStates = () =>
{
    const [states, setStates] = useState([]);

    useEffect(()=>
    {
        const axiosSource = axios.CancelToken.source();
        
        stateList(axiosSource);

        return () => {axiosSource.cancel()};
    }, []);

    const stateList = async (axiosSource) =>
    {
        try
        {
            setStates([{id: 0, sigla: "Carregando..."}]);
            const response = await axios.get(IBGE_ESTADOS, {cancelToken: axiosSource.token});
            setStates(response.data);
        }
        catch(error)
        {
            if(!axios.isCancel(error))
            {
                setStates([{id: 0, sigla: "Falha ao carregar os dados do IBGE"}]);
                console.log(error);
            }
        }
    }

    return {states, stateList};
}