import React  from "react";

//Constants
import {DATE_FORMAT} from "../../constants/constants";

//Date Picker
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/pt-br";
import {FaRegCalendarAlt} from "react-icons/fa";

//SCSS
import "./style.scss";

export default function DatePicker(props)
{
    const {onChange = (e) => {}, value, placeholder, disablePast, name, className, refForm, maxDate} = props;
    const {required, min, max, minLength, maxLength, pattern, validate, title, disableFuture} = props;

    return(
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
                name={name}
                clearable
                title={title}
                maxDate={maxDate}
                clearLabel={"Limpar"}
                cancelLabel={"Cancelar"}
                className={`mui-datepicker-custom ${className}`}
                placeholder={placeholder}
                invalidDateMessage={null}
                helperText={null}
                disablePast={disablePast}
                disableFuture={disableFuture}
                inputVariant={"standard"}
                value={value}
                onChange={onChange}
                format={DATE_FORMAT}
                keyboardIcon={<FaRegCalendarAlt />}
                InputProps={{disableUnderline: true}}
                inputRef={refForm(
                    {
                        required: required, 
                        min: min,
                        max: max,
                        minLength: minLength, 
                        maxLength: maxLength,
                        pattern: pattern,
                        validate: validate
                    })}
            />
        </MuiPickersUtilsProvider>
    );
}