import React from "react";
import  {Table}  from 'rsuite';
import {LOCALE_RSTABLE} from "../../constants";

const StatementListTable = ({statements}) =>
{
    const isDebit = (rawData) =>
    {
        return rawData["type"] === "Débito";
    } 

    const CustomCell = ({rowData, rowIndex, dataKey, ...props}) => 
    (
        <Table.Cell {...props} style={isDebit(rowData) ? {color: "red"} : {}}>
            {dataKey ? rowData[dataKey] : rowIndex + 1}
        </Table.Cell>
    );

    const NumberFormatCustomCell = ({rowData, rowIndex, dataKey, ...props}) =>
    (
        <Table.Cell {...props} style={isDebit(rowData) ? {color: "red"} : {}}>
            {dataKey && Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(rowData[dataKey])}
        </Table.Cell>
    );

    return(
        <>
        <Table height={400} data={statements.data} loading={statements.loading} headerHeight={48} locale={LOCALE_RSTABLE}>
            <Table.Column width={60} align="center">
                <Table.HeaderCell>#</Table.HeaderCell>
                <CustomCell />
            </Table.Column>

            <Table.Column width={400} fixed>
                <Table.HeaderCell>Descrição</Table.HeaderCell>
                <CustomCell dataKey="description"/>
            </Table.Column>

            <Table.Column width={160}>
                <Table.HeaderCell align="left">Data</Table.HeaderCell>
                <CustomCell dataKey="date"/>
            </Table.Column>

            <Table.Column width={100}>
                <Table.HeaderCell>Tipo</Table.HeaderCell>
                <CustomCell dataKey="type"/>
            </Table.Column>

            <Table.Column width={150}>
                <Table.HeaderCell>Valor</Table.HeaderCell>
                <NumberFormatCustomCell dataKey="value"/>
            </Table.Column>

            <Table.Column width={150}>
                <Table.HeaderCell>Saldo</Table.HeaderCell>
                <NumberFormatCustomCell dataKey="value"/>
            </Table.Column>
        </Table>
        </>
    );
}

export default StatementListTable;