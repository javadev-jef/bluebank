import { useEffect, useState } from "react";
import axios from "axios";
import {IBGE_ESTADOS} from "../constants/constants.js";


export const useStates = () =>
{
    const [states, setStates] = useState([]);

    useEffect(()=>
    {
        stateList();
    }, []);

    const stateList = async () =>
    {
        try
        {
            setStates([{id: 0, sigla: "Carregando..."}]);
            const response = await axios.get(IBGE_ESTADOS);
            setStates(response.data);
        }
        catch(error)
        {
            setStates([{id: 0, sigla: "Falha ao carregar os dados"}]);
            console.log(error);
        }
    }

    return {states, stateList};
}