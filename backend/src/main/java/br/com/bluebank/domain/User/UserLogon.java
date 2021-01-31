package br.com.bluebank.domain.User;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@SuppressWarnings("serial")
public class UserLogon implements Serializable 
{
    @NotBlank(message = "Não foi infomado nenhuma Conta ou CPF/CNPJ")
    @Size(max = 14, message = "Máximo permitido para o campo são 14 caracteres")
    @Size(min = 5, message = "Minimo permitido para o campo são 5 caracteres")
    private String username;

    @NotBlank(message = "A senha não pode ser vazia")
    @Size(min = 6, message = "A senha informada é muito pequena")
    @Size(max = 80, message = "A senha informada é muito grande")
    private String password;

    @NotNull(message = "Nenhuma opção de login foi selecionada")
    private LogonType logonType;

    public enum LogonType 
    {
        NUM_ACCOUNT, CPF_CNPJ;
    }
}
