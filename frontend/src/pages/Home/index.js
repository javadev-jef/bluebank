import React from "react";
import {RiExchangeDollarLine, RiMoneyDollarCircleLine} from "react-icons/ri";
import {RiWallet3Line, RiHandCoinLine} from "react-icons/ri";

import "./style.scss";
import { useState } from "react";
import OptionCard from "../../components/Card/OptionCard";
import Item from "../../components/Card/OptionCard/Item";
import ContaCard from "../../components/Card/ContaCard";
import ItemConta from "../../components/Card/ContaCard/ItemConta";
import Navbar from "../../components/Navbar";

export default function Home()
{
    const [isShowSaldo, setIsShowSaldo] = useState(true);

    const handleVisibleSaldo = () =>
    {
        setIsShowSaldo(!isShowSaldo);
    }

    return(
        <div className="home-container">
            <Navbar username="João"/>
            <main>
                <ContaCard title="Saldo em conta" handleShowSaldo={handleVisibleSaldo}>
                    <ItemConta label="CC" numConta="1234-1" valueConta="R$ 1.594,54" show={isShowSaldo}/>
                    <ItemConta label="CP" numConta="4321-2" valueConta="R$ 9.942,41" show={isShowSaldo}/>
                </ContaCard>
                <OptionCard title="Menu">
                    <Item label="Extrato" Icon={RiWallet3Line} to="/statement" />
                    <Item label="Transferência" Icon={RiExchangeDollarLine} to="/transfer" />
                    <Item label="Deposito" Icon={RiMoneyDollarCircleLine} to="/deposit" />
                    <Item label="Saque" Icon={RiHandCoinLine} to="/withdraw" />
                </OptionCard>
            </main>
        </div>
    );
}