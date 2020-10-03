import { useCallback, useState } from "react"
import axios from "axios";
import {IBGE_CIDADES} from "../constants/constants.js";

export const useCities = () =>
{
    const [cities, setCities] = useState([]);

    const cityList = useCallback(async (idEstado) =>
    {
        try
        {
            setCities([{id: 0, nome: "Carregando..."}]);
            const response = await axios.get(IBGE_CIDADES(idEstado));
            setCities(response.data);
            
        }
        catch(error)
        {
            console.log(error);
            setCities([{id: -1, nome: "Falha ao carregar os dados"}])
        }
    }, [])

    return {cities, setCities, cityList};
}