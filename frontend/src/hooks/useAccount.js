import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { API_ENDPOINT } from "../constants/constants";
import { AuthContext } from "./useAuth";
import { useHandleResponseError } from "./useHandleResponseError";

export const useAccount = (setAlertMessage) =>
{
    const {credentials, buildAuthHeader} = useContext(AuthContext);
    const [accounts, setAccounts] = useState([]);
    const [processing, setProcessing] = useState(false);
    const {getResponseHandled} = useHandleResponseError();

    const fetchAccounts = useCallback(async (axiosSource) =>
    {
        setProcessing(true);

        try
        {
            const serverUrl = `${API_ENDPOINT}/user/account/balance`;
            const {data} = await axios.get(serverUrl, {...buildAuthHeader(), cancelToken: axiosSource.token});
            setAccounts(data);
            
            setProcessing(false);
                
        }
        catch(error)
        {
            if(!axios.isCancel(error))
            {
                setProcessing(false);
                const {alertError} = getResponseHandled(error);
                setAlertMessage(alertError)
            }
        }
    }, 
    [buildAuthHeader, setAlertMessage, getResponseHandled]);

    useEffect(() => 
    {
        if(credentials.token != null)
        {
            const axiosSource = axios.CancelToken.source();

            fetchAccounts(axiosSource);

            return () => {axiosSource.cancel()};
        }
    }, 
    [credentials, fetchAccounts]);

    return{
        accounts, processing
    }
}