import React from "react";
import { Link } from "react-router-dom";

const Item = ({Icon, to, label}) =>
{
    return(
        <Link to={to}>
            <div className="card c-select">
                <Icon className="icon" />
                <span>{label}</span>
            </div>
        </Link>         
    );
}

export default Item;