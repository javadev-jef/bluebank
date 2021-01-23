import React from "react";
import moment from "moment";
import {FiX, FiPrinter} from "react-icons/fi";

import "./style.scss"
import { formatCurrencyValue } from "../../../utils/functionUtils";
import Logo from "../../../components/Logo";

const Receipt = React.forwardRef(({onClose = ()=>{}, onPrint = ()=>{}, data, serverComponents}, ref) =>
{

    const {accountTypes, cashTypes} = serverComponents;

    return(
        <div className="receipt-container" ref={ref}>
            <div className="side-left">
                <div className="field-labels header">
                    <span className="label">Recibo para</span>
                    <span className="value">{data.depositorName}</span>
                </div>

                <div className="field-labels">
                    <span className="label">Depositado em</span>
                    <span className="value">{cashTypes.find(dType => dType.type === data.cashType).displayName}</span>
                </div>

                <div className="field-labels">
                    <span className="label">Valor Depositado</span>
                    <span className="value">{formatCurrencyValue(data.amount)}</span>
                </div>

                <div className="field-labels">
                    <span className="label">Conta/Tipo</span>
                    <span className="value">
                        {`${data.numAccount} - ${accountTypes.find(acc => acc.type === data.accountType).displayName}` }
                    </span>
                </div>

                <div className="field-labels">
                    <span className="label">Chave de Identificação</span>
                    <span className="value">-</span>
                </div>
            </div>
            <div className="side-right">
               <header>
                   <span className="date">
                       {moment(data.dateTime).format("LLLL")}
                   </span>
                   <Logo toPage="#"/>
                   <div className="actions">
                       <FiPrinter onClick={onPrint}/>
                       <FiX onClick={onClose}/>
                   </div>
               </header>
               <section>
                   <h3>Comprovante de Deposito</h3>
                   <p>Deposito realizado no valor de <strong>{formatCurrencyValue(data.amount)}</strong> para {data.userName}.</p>
                   <div className="notes">
                        Depositos realizados após 18h00 serão compensados somente no próximo dia.
                   </div>
               </section>
               <footer>
                   www.bluebank.com.br
               </footer>
            </div>
        </div>
    );
});

export default Receipt;