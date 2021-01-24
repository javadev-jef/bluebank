import React from "react";

import NumberFormat from 'react-number-format';
import { Controller } from "react-hook-form";

export default function InputDecimalFormat({useFormControl, placeholder, name, title, className, ...props})
{ 
    return(
        <Controller 
            control={useFormControl}
            render={({onChange, value}) =>(
                <NumberFormat 
                    {...props}
                    placeholder={placeholder}
                    thousandSeparator="." 
                    decimalSeparator=","
                    onValueChange={(e) => onChange(e.floatValue)}
                    value={value}
                    title={title}
                    className={className}
                />
            )}
            name={name}
            defaultValue=""
        />
    );
}