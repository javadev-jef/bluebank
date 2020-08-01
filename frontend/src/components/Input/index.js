import React from "react";

export default function Input({required, min, max, minLength, maxLength, pattern, validate, refForm, ...props})
{ 
    return(
        <input 
            {...props}
            ref={
                refForm(
                {
                    required: required, 
                    min: min,
                    max: max,
                    minLength: minLength, 
                    maxLength: maxLength,
                    pattern: pattern,
                    validate: validate
                })
            }
        />
    );
}