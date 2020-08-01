import { useState } from "react";
import axios from "axios";
import {IBGE_ESTADOS} from "../constants/constants.js";


export const useEstados = () =>
{
    const [estados, setEstados] = useState([]);

    const list = async () =>
    {
        try
        {
            const response = await axios.get(IBGE_ESTADOS);
            setEstados(response.data);
        }
        catch(error)
        {
            console.log(IBGE_ESTADOS);
            console.log(error);
        }
    }

    return {estados, list};
}