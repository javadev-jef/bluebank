package br.com.bluebank.domain.Movement;

import java.io.Serializable;
import java.time.LocalDate;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@SuppressWarnings("serial")
public class StatementFilter implements Serializable
{
    @NotBlank(message = "Nenhuma conta foi informada.")
    private String numAccount;

    @NotNull(message = "A data inicial não foi selecionada")
    private LocalDate initialDate;

    @NotNull(message = "A data final não foi informada")
    private LocalDate finalDate;
}