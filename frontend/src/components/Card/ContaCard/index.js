import React, { useState } from "react";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";

import "./style.scss";

const ContaCard = ({children, title, handleShowSaldo}) =>
{
    const [show, setShow] = useState(false);

    const handleSaldo = () =>
    {
        // TODO: Implementar Hook para gravar o "show" via JWT/localStorage
        setShow(!show);
        return handleShowSaldo();
    }
    
    return(
        <>
            <h3>{title}
            {
                show ? <AiFillEye onClick={handleSaldo} /> : <AiFillEyeInvisible onClick={handleSaldo} />
            }
            </h3>
            <div className="card-list cl-conta">
                {children}
            </div>
        </>
    );
}

export default ContaCard;