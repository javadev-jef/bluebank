import React from 'react';
import "./style.scss";
import deviceImg from "../../assets/alert-resolution.svg";

function ResolutionError() 
{
  return (
    <div className="resolution-error">
        <h2>A tela do dispositivo/caixa atual não é suportada.</h2>
        <img src={deviceImg} alt="Tela não suportada"/>
    </div>
  );
}

export default ResolutionError;