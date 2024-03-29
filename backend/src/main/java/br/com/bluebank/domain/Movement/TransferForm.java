package br.com.bluebank.domain.Movement;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.User.User.PersonType;
import br.com.bluebank.utils.StringUtils;
import lombok.Getter;
import lombok.Setter;


@Getter @Setter
@SuppressWarnings("serial")
public class TransferForm implements Serializable
{
    @NotNull(message = "O tipo da conta do usuário não foi informado")
    private AccountType userAccountType;

    @Size(min = 5, message = "A conta do usuário de destino deve possui no minimo 5 digitos")
    @NotBlank(message = "A conta do usuário de destino não pode ser vázia")
    private String numAccount;

    @NotNull(message = "O tipo da conta não foi informado")
    private AccountType accountType;

    @NotNull(message = "O tipo de pessoa não foi informado")
    private PersonType personType;

    @Pattern(regexp = "[0-9]{11}|[0-9]{14}", message = "CPF/CNPJ informado é inválido")
    @NotBlank(message = "Não foi informado nenhum CPF/CNPJ")
    private String cpfCnpj;

    @Min(value = 10, message = "Valor minimo para transferências é de R$ 10,00")
    @NotNull(message = "O valor da transferência não foi informado")
    private BigDecimal amount;

    @Size(min = 6, message = "A descrição deve possui no minimo 6 caracteres")
    private String description;

    @FutureOrPresent(message = "Não é permitido informadar datas do passado")
    @NotNull(message = "A data da transferência não foi informada")
    private LocalDate whenToDo;

    public boolean hasDescription()
    {
        return !StringUtils.isEmpty(this.description);
    }
}