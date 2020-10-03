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

export default function DatePicker({refForm, disabled, onChange = () => {}, className, ...props})
{
    return(
        <MuiPickersUtilsProvider utils={MomentUtils}>
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
        </MuiPickersUtilsProvider>
    );
}