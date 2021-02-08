import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { API_ENDPOINT } from "../constants/constants";
import { AuthContext } from "./useAuth";
import { DisconnectType, useHandleResponseError } from "./useHandleResponseError";

export const useDefaultResponseServer = (setAlertMessage) =>
{
    const {buildAuthHeader, isAuthenticated} = useContext(AuthContext);
    const [serverComponents, setServerComponents] = useState([]);
    const {getResponseHandled} = useHandleResponseError();

    const getDefaultResponse = useCallback(async (axiosSource) =>
    {
        try
        {
            const condition = isAuthenticated() && !!buildAuthHeader();
            const serverUrl = `${API_ENDPOINT}/server/default-response/${condition ? 'private' : 'public'}`;
            const headers = condition ? {...buildAuthHeader(), cancelToken: axiosSource.token} : {cancelToken: axiosSource.token};
            
            const {data} = await axios.get(serverUrl, headers);
            setServerComponents(data);

        }
        catch(error)
        {
            if(!axios.isCancel(error))
            {
                const {alertError} = getResponseHandled(error, DisconnectType.ONLY_DISCONNECT);
                setAlertMessage(alertError);
            }
        }
    },[buildAuthHeader, setAlertMessage, getResponseHandled, isAuthenticated]);

    useEffect(() =>
    {
        const axiosSource = axios.CancelToken.source();

        getDefaultResponse(axiosSource);

        return () => {axiosSource.cancel()};
    }, 
    [getDefaultResponse]);

    return {serverComponents};
}