import React, { useState } from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";

import "./style.scss";

const ContaCard = ({children, title, handleShowSaldo}) =>
{
    const [isShow, setisShow] = useState(false);

    const handleSaldo = () =>
    {
        // TODO: Implementar Hook para gravar o "isShow" via JWT/localStorage
        setisShow(!isShow);
        return handleShowSaldo();
    }
    
    return(
        <>
            <h3>{title}
            {
                isShow ? <AiOutlineEye onClick={handleSaldo} /> : <AiOutlineEyeInvisible onClick={handleSaldo} />
            }
            </h3>
            <div className="card-list">
                {children}
            </div>
        </>
    );
}

export default ContaCard;