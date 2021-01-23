import React from "react";
import {Link} from "react-router-dom";
import {FiPower} from "react-icons/fi";

import "./style.scss";
import Logo from "../Logo";

const Navbar = ({username = "usuário"}) =>
{
    const handleLogout = () =>
    {
        console.log("Leaving...");
    }

    return(
        <header className="navbar">
            <Logo toPage="/home"/>
            <span className="welcome">{`Bem vindo, ${username}!`}</span>
            <Link className="button" to="/profile">Meus Dados</Link>
            <button className="btn-logout" title="Sair" onClick={handleLogout}>
                <FiPower />
            </button>
        </header>
    );
}

export default Navbar;