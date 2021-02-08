import axios from "axios";
import jwt_decode from "jwt-decode";
import { createContext, useCallback, useEffect, useState } from "react";
import { API_ENDPOINT } from "../constants/constants";

export const AuthContext = createContext();

export const useAuth = () =>
{
    const [credentials, setCredentials] = useState({username: null, name: "Usuário", token: null});
    const [fieldErrors, setFieldErrors] = useState(null);
    const [alertMessage, setAlertMessage] = useState({});
    const [processing, setProcessing] = useState(false);

    const loadCredentials = useCallback(() =>
    {
        const storedCredentials = sessionStorage.getItem("credentials");

        if(storedCredentials !== null)
        {
            setCredentials(JSON.parse(storedCredentials));
        }
    }, []);

    useEffect(() => 
    {
        loadCredentials();
    },
    [loadCredentials]);

    const clearStates = useCallback(() =>
    {
        setFieldErrors(null);
        setAlertMessage({});
        setProcessing(false);
    }, 
    []);

    const requestLogin = async (data) =>
    {
        setProcessing(true);
        try
        {
            const serverUrl = "http://localhost:8080/login";
            const response = await axios.post(serverUrl, data);
            const token = response.headers["authorization"].replace("Bearer ", "");
            storeCredentials(token);
        }
        catch(error)
        {
            const response = error.response;
            const data = response && response.data;
            const errors = response && data.errors;
            const message = response && data.message;

            if(response && errors && message && response.status === 401)
            {
                setFieldErrors(errors);
                setAlertMessage({type: "error", value: message, open: true});
            }
            else if(response && errors && response.status === 400)
            {
                setFieldErrors(errors);
                setAlertMessage({type: "error", value: "Ops! Os dados não foram preenchidos corretamente.", open: true});
            }
            else if(response && message)
            {
                setAlertMessage({type: "error", value: message, open: true});
            }
            else if(response && response.status === 500)
            {
                setAlertMessage({type: "error", value: "500: Ocorreu algum ssserro no servidor, tente mais tarde.", open: true});
            }
            else{
                setAlertMessage({type: "error", value: "Falha na tentativa de conexão com servidor.", open: true});
            }
        }
        setProcessing(false);
    }

    const requestLogout = async (expiredMsg) =>
    {
        try
        {
            await axios.delete(`${API_ENDPOINT}/user/logout`, buildAuthHeader());
            const msg = {type: "info", value: "Logout realizado com sucesso!", open: true};
            const expiredSession = expiredMsg.open ? expiredMsg : msg;
            sessionStorage.setItem("expiredSession", JSON.stringify(expiredSession));
        }
        catch(error)
        {
            console.log(error)
        }
        finally
        {
            clearCredentials();
        }
    }

    const clearCredentials = useCallback(() =>
    {
        sessionStorage.removeItem("credentials");
        setCredentials({username: null, name: "Usuário", token: null});
    }, []);

    const storeCredentials = (token) =>
    {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const credentials = {username: tokenData.sub, name: tokenData.name, token: token};
        
        sessionStorage.setItem("credentials", JSON.stringify(credentials));
        setCredentials(credentials);
    }

    const isAuthenticated = () =>
    {
        return sessionStorage.getItem("credentials") !== null;
    };

    const isTokenExpired = () =>
    {
        const {token} = JSON.parse(sessionStorage.getItem("credentials"));

        if(token !== null)
        {
            const jwtPayload = jwt_decode(token);
            const currentTime = Date.now().valueOf() / 1000;
            const expirationTime = jwtPayload.exp;
            const condition = currentTime >= expirationTime;

            if(condition)
            {
                const expiredSession = JSON.stringify({type: "error", value: "Sua sessão expirou, realize um novo login para continuar!", open: true});
                sessionStorage.setItem("expiredSession", expiredSession);

                return condition;
            }
            
            return false;
        }

        return true;
    };

    const buildAuthHeader = useCallback(() =>
    {
        if(credentials.token != null)
        {
            return{
                headers: {
                    "Authorization": `Bearer ${credentials.token}`
                }
            }
        }
        return null;
    }, 
    [credentials.token]);

    return {
        requestLogin, requestLogout, isAuthenticated, buildAuthHeader, clearCredentials,
        clearStates, isTokenExpired, alertMessage, credentials, fieldErrors, processing
    };
}