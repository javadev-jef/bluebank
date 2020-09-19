package br.com.bluebank.domain.Movement;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.bluebank.domain.Account.Account.AccountType;
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
    private WithdrawType type;

    @JsonIgnore
    public boolean isAmountNotValidForType()
    {
        double result = amount.doubleValue() - amount.intValue();
        return this.type == WithdrawType.CASH && result != 0;
    }

    @Getter
    public enum WithdrawType
    {
        CASH("Dinheiro"),
        BLUECOIN("BlueCoin");

        public String displayName;

        WithdrawType(String displayName)
        {
            this.displayName = displayName;
        }
    }
}
