package br.com.bluebank.domain.Account;

import java.io.Serializable;
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
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.bluebank.application.utils.StringUtils;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.User.User;
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

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Movement> movements = new ArrayList<>();

    public void setNumAccount(String lastNumAccount)
    {
        MonthDay md = MonthDay.from(LocalDate.now());
        String month = StringUtils.leftZeroes(md.getMonthValue(), 2);
        String day = StringUtils.leftZeroes(md.getDayOfMonth(), 2);

        if(lastNumAccount == null)
        {
            //Ex: '08' + '01' + '0' = '08010'
            lastNumAccount = month + day + StringUtils.leftZeroes(0, 1);
        }

        //Ex: seq = 0
        int seq = Integer.parseInt(lastNumAccount.substring(4));
        seq++;

        this.numAccount = month + day + seq;
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