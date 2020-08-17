import React from "react";

export default function Select({data, placeholder, required, min, max, minLength, maxLength, pattern, validate, refForm, valueOptName, descOptName, ...props})
{
    return(
        <select {...props} ref={refForm(
            {
                required: required, 
                min: min,
                max: max,
                minLength: minLength, 
                maxLength: maxLength,
                pattern: pattern,
                validate: validate
            })}>
            {placeholder && <option value={0} hidden>{placeholder}</option>}
            {data.map(obj => <option key={obj.id} value={obj[valueOptName]}>{obj[descOptName]}</option>)}
        </select>
    );
}