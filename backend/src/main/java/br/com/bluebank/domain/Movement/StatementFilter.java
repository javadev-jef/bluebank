package br.com.bluebank.domain.Movement;

import java.io.Serializable;
import java.time.LocalDate;

import javax.validation.constraints.NotNull;

import br.com.bluebank.domain.Account.Account.AccountType;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@SuppressWarnings("serial")
public class StatementFilter implements Serializable
{
    @NotNull(message = "O tipo da conta não foi informado")
    private AccountType accountType;

    @NotNull(message = "A data inicial não foi selecionada")
    private LocalDate initialDate;

    @NotNull(message = "A data final não foi informada")
    private LocalDate finalDate;
}