import React, { useState } from "react";

import "./style.scss";

import cofrinhoImg from "../../assets/cofrinho.svg";
import {FiLogIn} from "react-icons/fi";
import {Link} from "react-router-dom";

export default function Logon()
{
    const options = [
        {value: "Conta", placeholder: "9999-9"},
        {value: "CPF", placeholder: "999.999.999-99"}
    ];

    const [optionLogon, setOptionLogon] = useState(options[0]);

    function handleOptionLogon(event)
    {
        const optionSelected = options.filter(opt => {return opt.value === event.target.value});
        setOptionLogon(optionSelected[0]);
    }

    return(
        <div className="logon-container">
            <section className="form">
                <h1 className="logo">
                    <span className="part-01">Blue</span>
                    <span className="part-02">Bank</span>
                </h1>
                <form>
                    <h1>
                        <span className="part-01">Olá,</span>
                        <span className="part-02">seja bem-vindo!</span>
                    </h1>
                    <div className="input-group">
                        <select name="option-logon" onChange={handleOptionLogon}>
                            {options.map(opt => 
                                <option key={opt.value} value={opt.value}>{opt.value}</option>
                            )}
                        </select>
                        <input placeholder={optionLogon.placeholder}/>
                    </div>

                    <input type="password" placeholder="Senha"/>
                    <input className="button" type="submit" value="Acessar"/>

                    <Link to="/register"><FiLogIn /> Quero abrir uma conta</Link>
                </form>
            </section>

            <img className="logon-image" src={cofrinhoImg} alt="Blue Bank"/>
        </div>
    );
}