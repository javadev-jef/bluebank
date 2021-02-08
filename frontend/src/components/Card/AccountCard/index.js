import { Card } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { formatCurrencyValue } from "../../../utils/functionUtils";
import AccountItem from "./AccountItem";
import "./style.scss";

const AccountCard = ({title = null, accounts = [], processing = false}) =>
{
    const [isShow, setIsShow] = useState(false);

    useEffect(() =>
    {
        const isShowBalance = localStorage.getItem("showBlueBankBalance");
        isShowBalance != null && setIsShow(JSON.parse(isShowBalance));
    }, [])

    const handleSaldo = () =>
    {
        localStorage.setItem("showBlueBankBalance", !isShow);
        setIsShow(!isShow);
    }
    
    return(
        <>
            {title !== null &&
                <h3>{title}
                    {isShow ? <AiOutlineEye onClick={handleSaldo} /> : <AiOutlineEyeInvisible onClick={handleSaldo} />}
                </h3>
            }
            <div className="card-list">
                {accounts.map(account => 
                    <AccountItem
                        key={account.numAccount} 
                        label={
                            account.accountType === "SAVINGS_ACCOUNT" ? "CP" : 
                            account.accountType === "CHECKING_ACCOUNT" && "CC"
                        } 
                        numConta={account.numAccount} 
                        valueConta={formatCurrencyValue(account.balance)} 
                        show={isShow}
                    />
                )}
                {accounts.length === 0 && 
                    <>
                        <Card className="card c-conta" style={{maxHeight: 74}}>
                            <Skeleton width="30%" height={22} animation={processing ? "pulse" : false}/>
                            <Skeleton width="80%" height={22} animation={processing ? "wave" : false}/>
                        </Card>
                        <Card className="card c-conta" style={{maxHeight: 74}}>
                                <Skeleton width="30%" height={22} animation={processing ? "pulse" : false}/>
                                <Skeleton width="80%" height={22} animation={processing ? "wave" : false}/>
                        </Card>
                    </>
                }
            </div>
        </>
    );
}

export default AccountCard;