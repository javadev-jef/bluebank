package br.com.bluebank.domain.Account;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.MonthDay;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.User.User;
import br.com.bluebank.utils.StringUtils;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "TBL_ACCOUNT")
@SuppressWarnings("serial")
public class Account implements Serializable
{
    @Id
    @Column(nullable = false, unique = true, length = 32)
    private String numAccount;

    @Column(nullable = false)
    @NotNull(message = "O tipo da conta não foi selecionado")
    private AccountType accountType;

    @ManyToOne @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @NotNull(message = "O saldo da conta não poder ser null")
    @Min(value = 0, message = "O saldo da conta não pode ser negativo")
    private BigDecimal balance;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Movement> movements = new ArrayList<>();

    public void setNumAccount(String lastNumAccount)
    {
        MonthDay md = MonthDay.from(LocalDate.now());
        String month = String.valueOf(md.getMonthValue());
        String day = StringUtils.leftZeroes(md.getDayOfMonth(), 2);

        if(lastNumAccount == null)
        {
            lastNumAccount = (month.length() == 1 ? 1 + month : month) + day + 0;
        }

        long tempLastNumAccount = Long.parseLong(lastNumAccount);
        tempLastNumAccount++;
        
        this.numAccount = String.valueOf(tempLastNumAccount);
    }

    public String getAccountTypeDisplayName()
    {
        return this.accountType.displayName;
    }
   
   @Getter
    public enum AccountType
    {
        SAVINGS_ACCOUNT("Conta Poupança"),
        CHECKING_ACCOUNT("Conta Corrente");

        public String displayName;

        AccountType(String displayName)
        {
            this.displayName = displayName;
        }
    }
}