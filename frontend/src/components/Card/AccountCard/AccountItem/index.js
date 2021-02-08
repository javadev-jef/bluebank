import React from "react";

const AccountItem = ({label, numConta, valueConta, show}) =>
{
    return(
        <div className="card c-conta">
            <span><strong>{label}:</strong>{numConta}</span>
            <span className={!show ? "blur-filter" : ""}><strong>Saldo:</strong>{valueConta}</span>
        </div>
    );
}

export default AccountItem;