import React, { useContext } from "react";
import { FiPower } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AuthContext } from "../../hooks/useAuth";
import Logo from "../Logo";
import "./style.scss";
import {routes} from "../../constants/paths.json";


const Navbar = () =>
{
    const {requestLogout, credentials} = useContext(AuthContext);

    return(
        <header className="navbar">
            <Logo toPage={routes.home}/>
            <span className="welcome">{`Bem vindo, ${credentials.name.split(" ")[0]}!`}</span>
            <Link className="button" to={routes.profile}>Meus Dados</Link>
            <button className="btn-logout" title="Sair" onClick={requestLogout}>
                <FiPower />
            </button>
        </header>
    );
}

export default Navbar;