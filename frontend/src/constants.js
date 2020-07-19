
export const IBGE_ESTADOS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

export const IBGE_CIDADES = (idEstado) => `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idEstado}/municipios`;

export const DATE_FORMAT = "DD/MM/YYYY";

export const LOCALE_RSDATE = {
    sunday: 'Dom',
    monday: 'Seg',
    tuesday: 'Ter',
    wednesday: 'Qua',
    thursday: 'Qui',
    friday: 'Sex',
    saturday: 'Sab',
    ok: 'OK',
    today: 'Hoje',
    yesterday: 'Ontem',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    last7Days: 'Ultimos 7 dias'
};

export const LOCALE_RSTABLE = {
    emptyMessage: "Nenhum registro encontrado",
    loading: "Carregando..."
}
