import React, { useState } from "react";

import "./style.scss";

import { Grid } from "@material-ui/core";
import cofrinhoImg from "../../assets/cofrinho.svg";
import {FiLogIn} from "react-icons/fi";
import {Link} from "react-router-dom";
import Logo from "../../components/Logo";

export default function Logon()
{
    const options = [
        {value: "Conta", placeholder: "99999"},
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
                <Logo toPage="#"/>
                <form>
                    <h1>
                        <span className="part-01">Olá,</span>
                        <span className="part-02">seja bem-vindo!</span>
                    </h1>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <select name="option-logon" onChange={handleOptionLogon}>
                                {options.map(opt => 
                                    <option key={opt.value} value={opt.value}>{opt.value}</option>
                                )}
                            </select>
                        </Grid>
                        <Grid item xs={6}>
                            <input placeholder={optionLogon.placeholder}/>
                        </Grid>
                        <Grid item xs={12}>
                            <input type="password" placeholder="Senha"/>
                        </Grid>
                    </Grid>

                    <input className="button" type="submit" value="Acessar"/>

                    <Link to="/register"><FiLogIn /> Quero abrir uma conta</Link>
                </form>
            </section>

            <img className="logon-image" src={cofrinhoImg} alt="Blue Bank"/>
        </div>
    );
}