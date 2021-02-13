import React from "react";

export default function Select({data, placeholder, refForm, valueName, labelName, ...props})
{
    return(
        <select {...props} ref={refForm}>
            {placeholder && <option value="" hidden>{placeholder}</option>}
            {data && data.map(obj => <option key={obj[valueName]} value={obj[valueName]}>{obj[labelName]}</option>)}
        </select>
    );
}