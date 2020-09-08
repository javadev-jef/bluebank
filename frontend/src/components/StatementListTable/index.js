import React from "react";
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles"
import { formatCurrencyValue } from "../../utils/functionUtils";
import "./style.scss";
import { CircularProgress, Backdrop } from "@material-ui/core";
import { TABLE_THEME, TABLE_TEXT_LABEL, DOWNLOAD_TABLE_CONFIG, DOWNLOAD_TABLE_OPTIONS } from "../../constants/constants";
import moment from "moment";

const StatementListTable = ({statements}) =>
{
    const theme = createMuiTheme(TABLE_THEME);

    const valueColumns = {
        customBodyRender: value => formatCurrencyValue(value),
    };

    const dateColumns = {
        customBodyRender: value => moment(value).format("DD/MM/YYYY HH:mm"),
    }

    const typeColumn = {
        customBodyRender: value => value < 0 ? "Débito" : "Crédito",
    }

    const headers = [
        {name: "description", label: "Descrição"},
        {name: "date", label: "Data", options:{...dateColumns}},
        {name: "finalAmount", label: "Tipo", options:{...typeColumn}},
        {name: "finalAmount", label: "Valor", options:{...valueColumns}},
        {name: "balance", label: "Saldo", options:{...valueColumns}}
    ];

    const options = 
    {
        sort: false,
        filter: false,
        search: false,
        rowHover: false,
        fixedHeader: true,
        selectableRows: "none",
        responsive: "standard",
        tableBodyHeight: "460px",
        downloadOptions: DOWNLOAD_TABLE_OPTIONS("Extrato - BlueBank.csv"),
        onDownload: DOWNLOAD_TABLE_CONFIG,
        textLabels: TABLE_TEXT_LABEL,
        setRowProps: (row, dataIndex, rowIndex) => 
        { 
            return parseInt(row[3].replace(/R\$\s/g, "")) < 0 && {style: {backgroundColor: "#ffe6e6", color: "#FF0000"}} 
        },
    };


    const backdropStyle = {
        zIndex: 101, 
        position: "absolute", 
        flexDirection: "column",
        background: "rgba(255, 255, 255, 0.5)", 
        borderRadius: "8px 8px 0 0",
    }

    return(
        <div style={{position: "relative"}}>
            <Backdrop open={statements.loading} style={backdropStyle}>
                <CircularProgress style={{color: "#0091EA", marginTop: "64px", marginBottom: "12px"}}/>
                <span>Carregando...</span>
            </Backdrop>
            <MuiThemeProvider theme={theme}>
                <MUIDataTable
                    title={"Extrato"}
                    data={statements.data}
                    columns={headers}
                    options={statements.loading ? {...options, customRowRender: () => null} : {...options, customRowRender: null}}
                    className="mui-datatable-custom"
                />
            </MuiThemeProvider>
        </div>
    );
}

export default StatementListTable;