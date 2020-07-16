import React from "react";

import "./style.scss";

const OptionCard = ({children, title}) =>
{
    return(
        <>
            <h3>{title}</h3>
            <div className="card-list cl-select">
                {children}  
            </div>
        </>
    );
}

export default OptionCard;