package br.com.bluebank.domain.Movement;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.com.bluebank.domain.Account.Account;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@SuppressWarnings("serial")
@Table(name = "TBL_MOVEMENT")
public class Movement implements Serializable
{
    @Id
    @Column(unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 60, nullable = false)
    @Size(max = 60, message = "O valor inserido ultrapassa 60 carecteres")
    @Size(min = 6, message = "O valor informado é muito curto para ser válido")
    private String description;

    @Column(nullable = false)
    @NotNull(message = "Nenhuma data foi informada")
    private LocalDateTime date;

    @NotNull(message = "O tipo do movimento não foi informado")
    private MovementType movementType;

    @Min(value = 1, message = "Não é permitido valores zerados ou negativos")
    private transient BigDecimal tempAmount;

    @Column(nullable = false, name = "amount")
    private BigDecimal finalAmount;

    @Column(nullable = false)
    @Min(value = 0, message = "Não é permitido valores negativos")
    private BigDecimal balance = BigDecimal.ZERO;

    @ManyToOne @JsonIgnore
    @JoinColumn(name = "num_account", nullable = false)
    private Account account;

    private Boolean scheduled = false;

    /**
     * Must be called by service and after setFinalAmount
     * @param currentBalance current balance value.
     */
    public void setBalance(BigDecimal currentBalance)
    {
        this.balance = currentBalance.add(finalAmount);
    }

    /**
     * It's not persisted in the database.
     * Must be set before setFinalAmount
     * @param value temp amount value
     */
    public void setTempAmount(BigDecimal value)
    {
        this.tempAmount = value;
    }

    /**
     * MovementType and tempAmount must be set before.
     * @param value final amount value.
     */
    public void setFinalAmount(BigDecimal value)
    {
        this.finalAmount = value.multiply(movementType.factor);
    }


    public enum MovementType
    {
        WITHDRAW("Saque", new BigDecimal(-1)),
        BONUS("Bonificação", new BigDecimal(1)),
        DEPOSIT("Deposito", new BigDecimal(-1)),
        TRANSFER_SOURCE("Origem da Transferência", new BigDecimal(-1)),
        TRANSFER_TARGER("Destino da Transferência", new BigDecimal(1));

        String displayName;
        BigDecimal factor;

        MovementType(String displayName, BigDecimal factor)
        {
            this.displayName = displayName;
            this.factor = factor;
        }
    }
}
