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

import br.com.bluebank.application.service.exception.InsufficienteBalanceException;
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
    @Size(max = 80, message = "O valor inserido ultrapassa 80 carecteres")
    @Size(min = 6, message = "O valor informado é muito curto para ser válido")
    private String description;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
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

    @Column(nullable = false)
    @NotNull(message = "O número da transação não pode ser null")
    private Long numTransaction;

    @Column(unique = true, nullable = false)
    private Long sequence;

    /**
     * Must be called by service and after setFinalAmount
     * 
     * @param currentBalance current balance value.
     */
    public void setBalance(BigDecimal currentBalance) throws InsufficienteBalanceException
    {
        currentBalance = currentBalance.add(finalAmount);

        if(currentBalance.compareTo(BigDecimal.ZERO) < 0)
        {
            throw new InsufficienteBalanceException();
        }

        this.balance = currentBalance;
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
     * Must be called by service
     * @param value final amount value.
     */
    public void setFinalAmount(BigDecimal value)
    {
        this.finalAmount = value.multiply(movementType.factor);
    }

    public void setNumTransaction(Long lastNumTransaction)
    {
        if(lastNumTransaction == null)
        {
            lastNumTransaction = 0L;
        }

        this.numTransaction = ++lastNumTransaction;
    }

    public void setSequence(Long lastSequence)
    {
        if(lastSequence == null)
        {
            lastSequence = 0L;
        }

        this.sequence = ++lastSequence;
    }

    @Getter
    public enum MovementType
    {
        WITHDRAW("Saque", new BigDecimal(-1)),
        BONUS("Bonificação", new BigDecimal(1)),
        DEPOSIT("Deposito", new BigDecimal(1)),
        TRANSFER_SOURCE("Origem da Transferência", new BigDecimal(-1)),
        TRANSFER_TARGET("Destino da Transferência", new BigDecimal(1));

        String displayName;
        BigDecimal factor;

        MovementType(String displayName, BigDecimal factor)
        {
            this.displayName = displayName;
            this.factor = factor;
        }
    }
}
