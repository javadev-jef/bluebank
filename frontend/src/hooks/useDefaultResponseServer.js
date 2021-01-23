import { useEffect, useState } from "react"
import axios from "axios";
import { API_ENDPOINT } from "../constants/constants";

export const useDefaultResponseServer = (setAlertProps) =>
{
    const [serverComponents, setServerComponents] = useState([]);

    useEffect(() =>
    {
        const getDefaultResponse = async () =>
        {
            try
            {
                const response = await axios.get(`${API_ENDPOINT}/default-response`);
                setServerComponents(response.data);
            }
            catch(error)
            {
                if(!error.response)
                {
                    setAlertProps({type: "error", message: "Erro na tentativa de conexão com o servidor.", open: true});
                }
            }
        };
        
        getDefaultResponse();
    }, [setAlertProps]);

    return {serverComponents};
}