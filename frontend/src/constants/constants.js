
export const IBGE_ESTADOS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

export const IBGE_CIDADES = (idEstado) => `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idEstado}/municipios`;

export const DATE_FORMAT = "DD/MM/YYYY";

export const FORM_ERROR_MESSAGES = {
    required: "O campo em destaque é obrigatório",
    maxLength: "O tamanho do campo informado é muito grande",
    minLength: "O tamanho do campo informado é muito pequeno",
    pattern: "O valor do campo informado é valido",
    validate: "O valor informado não está no formato correto",
    invalidDate: "Formato de data informado é inválido",
    minDate: "Não é permitido datas anteriores ao dia atual",
    maxDate: "Não é permitido a seleção de datas futuras",
    select: "Nenhuma opção da lista foi selecionada",
    invalidNumber: "Campo númerico vazio ou invalido",
    strToNumberError: "Somente números é permitido neste campo",
    invalidInitialDate: "Data inicial não pode ser maior que a data final",
    invalidFinalDate: "Data final não pode ser menor que a data inicial",
}

export const TABLE_TEXT_LABEL = {
    body:
    {
        noMatch: "Nenhum registro encontrado",
    },
    pagination: 
    {
        next: "Próxima Página",
        previous: "Página Anterior",
        rowsPerPage: "Registros por página:",
        displayRows: "de",
    },
    toolbar: {
        search: "Pesquisar",
        downloadCsv: "Download CSV",
        print: "Imprimir",
        viewColumns: "Exibir Colunas",
        filterTable: "Filtrar Tabela",
      },
    viewColumns: 
    {
        title: "Exibir Colunas",
        titleAria: "Exibir/Esconder Colunas da Tabela",
    },
}

export const DOWNLOAD_TABLE_CONFIG = (buildHead, buildBody, columns, data) => 
{
    console.log(data)
    return "\uFEFF" + buildHead(columns) + buildBody(data);
}

export const DOWNLOAD_TABLE_OPTIONS = (filename) => 
{
    return {
        filename: filename,
        separator: ";",
        filterOptions:
        {
            useDisplayedColumnsOnly: true,
            useDisplayedRowsOnly: true,
        }
    }
}

export const TABLE_THEME = {
    overrides: 
    {
        MUIDataTable:
        {
            paper:
            {
                borderRadius: "8px 8px 0 0 !important",
            }
        },
        MUIDataTableToolbar:
        {
            root:
            {
                backgroundColor: "#f6f6f6",
                borderRadius:"8px 8px 0 0"
            }
        },
        MUIDataTableHeadCell:
        {
            root:
            {
                fontFamily: "'Exo 2', sans-serif !important",
                backgroundColor: "#f6f6f6 !important",
                fontWeight: "600",
                fontSize: "16px !important",
            }
        },
        MUIDataTableBodyCell: 
        {
            root: 
            {
                backgroundColor: "transparent",
                color: "inherit",
            }
        },
        MUIDataTableBody:
        {
            emptyTitle:
            {
                fontFamily: "'Exo 2', sans-serif !important",
                minHeight: "370px",
                lineHeight: "370px"
            }
        },
        MUIDataTableFooter:
        {
            root:
            {
                borderTop: "1px #e6e6e6 solid",
                backgroundColor: "#f6f6f6"
            }
        },
    }
}
