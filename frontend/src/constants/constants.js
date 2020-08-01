
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
    strToNumberError: "Somente números é permitido neste campo"
}
