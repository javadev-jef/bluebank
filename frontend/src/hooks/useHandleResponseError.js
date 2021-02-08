import { useCallback, useContext } from "react";
import { AuthContext } from "./useAuth";

export const DisconnectType = {
    ONLY_DISCONNECT: 0,
    FULL_DISCONNECT: 1
}

export const useHandleResponseError = () =>
{
    const {clearCredentials} = useContext(AuthContext);
    
    /**
     * 
     * @param {Error} error Axios response error
     * @param {DisconnectType} disconectType DisconnectedType
     */
    const getResponseHandled = useCallback((error, disconectType = DisconnectType.FULL_DISCONNECT) =>
    {
        const response = error.response;
        const data = response && response.data;
        const errors = response && data.errors;
        const message = response && data.message;
        let alertError = {};
        let fieldErrors = {};

        if(response && message && response.status === 401)
        {
            switch (disconectType) 
            {
                case DisconnectType.ONLY_DISCONNECT:
                {
                    clearCredentials();
                    break;
                }
                case DisconnectType.FULL_DISCONNECT:
                {
                    const expiredSession = JSON.stringify({type: "error", value: message, open: true});
                    sessionStorage.setItem("expiredSession", expiredSession);
                    clearCredentials();
                    break;
                }
                default:
                {
                    console.log("DisconnectType informado não é valido");
                }
            }
        }
        else if(response && errors && response.status === 400)
        {
            fieldErrors = errors;
            alertError = {type: "error", value: "Ops! Os dados não foram preenchidos corretamente.", open: true};
        }
        else if(response && message)
        {
            alertError = {type: "error", value: message, open: true};
        }
        else if(response && response.status === 500)
        {
            alertError = {type: "error", value: "500: Ocorreu algum erro no servidor, tente mais tarde.", open: true};
        }
        else{
            alertError = {type: "error", value: "Falha na tentativa de conexão com servidor.", open: true};
        }

        return {alertError, fieldErrors};
    }, 
    [clearCredentials]);

    return{
        getResponseHandled
    }
}