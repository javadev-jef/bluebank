import React from "react";

const ItemConta = ({label, numConta, valueConta, show}) =>
{
    return(
        <div className="card c-conta">
            <span><strong>{label}:</strong>{numConta}</span>
            <span className={!show ? "blur-filter" : ""}><strong>Saldo:</strong>{valueConta}</span>
        </div>
    );
}

export default ItemConta;