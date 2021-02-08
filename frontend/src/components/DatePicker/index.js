import { KeyboardDatePicker } from "@material-ui/pickers";
import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { DATE_FORMAT } from "../../constants/constants";
import "./style.scss";

export default function DatePicker({refForm, disabled, onChange = () => {}, className, ...props})
{
    return(
        <KeyboardDatePicker
            {...props}
            clearable
            clearLabel={"Limpar"}
            cancelLabel={"Cancelar"}
            className={`mui-datepicker-custom ${className} ${disabled && 'mdc-disabled'}`}
            invalidDateMessage={null}
            helperText={null}
            inputVariant={"standard"}
            onChange={onChange}
            format={DATE_FORMAT}
            keyboardIcon={<FaRegCalendarAlt />}
            InputProps={{disableUnderline: true}}
            inputRef={refForm}
        />
    );
}