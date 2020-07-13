
export const IBGE_ESTADOS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

export const IBGE_CIDADES = (idEstado) => `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idEstado}/municipios`;
