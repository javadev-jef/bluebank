import React from "react";
import {FiX, FiPrinter} from "react-icons/fi";

import "./style.scss"
import { formatCurrencyValue } from "../../../utils/functionUtils";

const BlueCoin = React.forwardRef(({onClose = ()=>{}, onPrint = ()=>{}, data}, ref) =>
{

    const DATA_QRCODE = JSON.stringify({...data, blueToken: undefined, userName: undefined}).replace(/"/g, "&#34");
    //console.log("Com aspas alteradas =>" + DATA_QRCODE);
    //console.log("Com aspas substituidas => " + DATA_QRCODE.replace(/&#34/g, "\""))

    //TODO: fetch QR CODE from backend.

    return(
        <div className="bluecoin-container" ref={ref}>
            <div className="side-left">
                <div className="qr-code" style={{backgroundImage: `url(https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0087D0&bgcolor=fff&data=${DATA_QRCODE})`}}>
                    {/*https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=FFF&bgcolor=0091EA&data=Example*/}
                </div>
            </div>
            <div className="side-right">
               <header>

                   <h1 className="logo">
                       <span className="part-01">Blue</span>
                       <span className="part-02">Bank</span>
                   </h1>
                   <div className="actions">
                       <FiPrinter onClick={onPrint}/>
                       <FiX onClick={onClose}/>
                   </div>
               </header>
               <section>
                   <h2>BlueCoin</h2>
                   <p>Está cédula possui o valor de <strong>{formatCurrencyValue(data.withdrawValue)}</strong>.</p>
                   <div className="notes">
                       Utilizavel para depositos, e pagamentos em serviços parceiros.
                   </div>
               </section>
               <footer>
                   www.bluebank.com.br
               </footer>
            </div>
        </div>
    );
});

export default BlueCoin;