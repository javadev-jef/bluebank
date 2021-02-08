import React, { useEffect, useState } from "react";
import { RiExchangeDollarLine, RiHandCoinLine } from "react-icons/ri";
import { RiMoneyDollarCircleLine, RiWallet3Line } from "react-icons/ri";
import AlertMessage from "../../components/AlertMessage";
import AccountCard from "../../components/Card/AccountCard";
import OptionCard from "../../components/Card/OptionCard";
import Item from "../../components/Card/OptionCard/Item";
import Navbar from "../../components/Navbar";
import { routes } from "../../constants/paths.json";
import { useAccount } from "../../hooks/useAccount";
import "./style.scss";

export default function Home({history})
{
    const [alertMessage, setAlertMessage] = useState({open: false});
    const {accounts, processing} = useAccount(setAlertMessage);

    useEffect(() =>
    {
        if(history.location.state && history.location.state.backPage === routes.logon)
        {
            setAlertMessage({type: "success", value: "Login realizado com sucesso!", open: true});
        }
    },
    [history]);

    // Clear history.location.state
    useEffect(() =>
    {
        if(alertMessage.open)
        {
            history.replace({...history.location, state: undefined});
        }
    }, 
    [alertMessage, history]);

    const dismissAlert = () =>
    {
        setAlertMessage({...alertMessage, open: false});
    }

    return(
        <div className="home-container">
            <Navbar />
            <main>
                <AccountCard 
                    title="Saldo em conta" 
                    accounts={accounts} 
                    processing={processing}
                />
                <OptionCard title="Menu">
                    <Item label="Extrato" Icon={RiWallet3Line} to={routes.statement}/>
                    <Item label="Transferência" Icon={RiExchangeDollarLine} to={routes.transfer} />
                    <Item label="Deposito" Icon={RiMoneyDollarCircleLine} to={routes.deposit} />
                    <Item label="Saque" Icon={RiHandCoinLine} to={routes.withdraw} />
                </OptionCard>
            </main>
            
            <AlertMessage 
                maxWidth={450} 
                open={alertMessage.open}
                autoHideDuration={5000} 
                severity={alertMessage.type}
                message={alertMessage.value}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                onClose={() => dismissAlert()}
            />
        </div>
    );
}