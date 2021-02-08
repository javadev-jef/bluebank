import React from "react";
import { CircularProgress } from "@material-ui/core";

const Button = ({type = "submit", value, loading, disabled, ...props}) =>
{
    return(
        <button 
            type={type}
            className="button" 
            disabled={disabled ? disabled : loading} 
            {...props} 
        >
            {loading ? <CircularProgress style={{color: "#FFF"}}/> : value}
        </button>
    );
}

export default Button;