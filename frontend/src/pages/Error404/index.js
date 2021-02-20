import React, { useContext } from "react";
import "./style.scss";
import {routes} from "../../constants/paths.json";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { AuthContext } from "../../hooks/useAuth";

export default function Error404()
{
    const {isAuthenticated} = useContext(AuthContext);

    return(
        <div className="error-404-container">
            <div>
                <h1>404</h1>
                <h3>Ops!</h3>
                <span>A página solicitada não foi encontrada.</span>
                <Link className="link-to" to={isAuthenticated() ? routes.home : routes.logon}>
                    <FiArrowLeft /> Voltar
                </Link>
            </div>
        </div>
    );
}