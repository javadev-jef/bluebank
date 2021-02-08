import React from "react";

export default function Input({refForm, ...props})
{ 
    return(
        <input 
            {...props}
            ref={refForm}
        />
    );
}