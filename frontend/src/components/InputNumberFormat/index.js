import React, { useState } from "react";
import { Controller } from "react-hook-form";

import NumberFormat from 'react-number-format';

export default function InputNumberFormat({useFormControl, placeholder, name, title, className, format, mask, altMask, ...props})
{ 
    const [inputMask, setInputMask] = useState(null);
    
    const inputMaskHandle = (e) =>
    {
        if(format == null)
        {
            const value = e.target.value;

            if(altMask != null)
            {
                setInputMask(value.length === mask.length ? mask.value : value.length === altMask.length ? altMask.value : null); 
            }
            else
            {
                setInputMask(value.length === mask.length ? mask.value : null);
            }
        }
    }

    const clearInputMask = () =>
    {
        setInputMask(null);
    }

    return(
        <Controller 
            control={useFormControl}
            render={({onChange, value}) =>(
                <NumberFormat 
                    {...props}
                    placeholder={placeholder}
                    onBlur={inputMaskHandle} 
                    onFocus={clearInputMask} 
                    format={inputMask == null ? format : inputMask}
                    title={title}
                    onValueChange={(e) => onChange(e.floatValue)}
                    value={value}
                    className={className}
                />
            )}
            name={name}
            defaultValue=""
        />
    );
}