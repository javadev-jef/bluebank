import { useState } from "react"
import axios from "axios";
import {IBGE_CIDADES} from "../constants/constants.js";

export const useCidades = () =>
{
    const [cidades, setCidades] = useState([]);

    const list = async (idEstado) =>
    {
        try
        {
            const response = await axios.get(IBGE_CIDADES(idEstado));
            setCidades(response.data);
        }
        catch(error)
        {
            console.log(error);
            setCidades([{id: -1, nome: "Falha ao carregar os dados"}])
        }
    }

    return {cidades, setCidades, list};
}