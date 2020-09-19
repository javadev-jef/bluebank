import React from "react";
import {FiX, FiPrinter} from "react-icons/fi";

import domtoimage from 'dom-to-image';

import "./style.scss"
import { formatCurrencyValue } from "../../../utils/functionUtils";

const BlueCoin = (({onClose = ()=>{}, data, qrcode}) =>
{
    const onDownload = () =>
    {
        domtoimage.toPng(document.getElementById("b-coin"),{ quality: 0.95 })
            .then((dataUrl) => 
            {
                var link = document.createElement("a");
                link.download = "BlueBank - Cédula de Saque.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((error) =>
            {
                console.log(error);
                console.log("Erro ao tentar realizar o download!");
            });
    }

    return(
        <div id="b-coin" className="bluecoin-container">

            <div className="side-left">
                <div className="qr-code" style={{backgroundImage: `url(data:image/png;base64,${qrcode})`}}>
                </div>
            </div>

            <div className="side-right">

               <header>
                   <h1 className="logo">
                       <span className="part-01">Blue</span>
                       <span className="part-02">Bank</span>
                   </h1>
                   <div className="actions">
                       <FiPrinter onClick={onDownload}/>
                       <FiX onClick={onClose}/>
                   </div>
               </header>

               <section>
                   <h2>BlueCoin</h2>
                   <p>Está cédula possui o valor de <strong>{formatCurrencyValue(data.amount)}</strong>.</p>
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