import React from "react";
import { Snackbar } from "@material-ui/core";
import {Alert} from '@material-ui/lab';

const AlertMessage = ({maxWidth, anchorOrigin, autoHideDuration, open, onClose, severity, message}) =>
{
    return(
        <Snackbar
            style={{maxWidth: maxWidth}}
            anchorOrigin={anchorOrigin}
            autoHideDuration={autoHideDuration}
            open={open}
            onClose={onClose}
        >
                <Alert elevation={6} variant="filled" severity={severity}>
                    {message}
                </Alert>
        </Snackbar>
    );
}

export default AlertMessage;