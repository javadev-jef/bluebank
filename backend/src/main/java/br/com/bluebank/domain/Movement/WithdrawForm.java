package br.com.bluebank.domain.Movement;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.utils.CashType;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@SuppressWarnings("serial")
public class WithdrawForm implements Serializable
{
    @NotNull(message = "O tipo da conta não foi informado")
    private AccountType accountType;

    @Min(value = 10, message = "Valor minimo para saques é de R$ 10,00")
    @NotNull(message = "O valor do saque não foi informado")
    private BigDecimal amount;

    @NotNull(message = "A forma de saque não foi informada")
    private CashType cashType;

    @JsonIgnore
    public boolean isAmountNotValidForType()
    {
        return this.cashType == CashType.CASH && amount.doubleValue() % 2 != 0;
    }
}
