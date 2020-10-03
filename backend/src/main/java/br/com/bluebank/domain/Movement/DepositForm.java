package br.com.bluebank.domain.Movement;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.web.multipart.MultipartFile;

import br.com.bluebank.application.service.exception.DepositException;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.infrastructure.web.validator.UploadConstraint;
import br.com.bluebank.utils.CashType;
import br.com.bluebank.utils.FileType;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@SuppressWarnings("serial")
public class DepositForm implements Serializable
{
    @Size(min = 5, message = "O número da conta deve possui no minimo 5 digitos")
    @NotBlank(message = "O número da conta não pode ser vázia")
    private String numAccount;

    @NotNull(message = "O tipo da conta não foi informado")
    private AccountType accountType;

    @Size(min = 4, message = "O nome do destinatário informando é muito pequeno")
    private String userName;

    @Size(min = 6, message = "O nome do depositante deve possui no minimo 6 caracteres")
    @NotNull(message = "O nome do depositante não foi informado")
    private String depositorName;    

    @Size(min = 11, max = 14, message = "O valor do campo não está correto")
    @Pattern(regexp = "[0-9]{11}|[0-9]{14}", message = "O campo informado possui dados inválidos")
    @NotBlank(message = "Não foi informado nenhum CPF/CNPJ")
    private String cpfCnpj;

    @Size(min = 10, max = 11, message = "O telefone informado é inválido")
    @Pattern(regexp = "[0-9]{10}|[0-9]{11}", message = "O campo informado possui dados inválidos")
    @NotBlank(message = "Não foi informado nenhum telefone")
    private String phone;

    @NotNull(message = "A forma de saque não foi informada")
    private CashType cashType;

    @UploadConstraint(acceptedTypes = FileType.PNG, message = "A arquivo anexado não é do tipo .png")
    private transient MultipartFile bluecoinFile;

    @Min(value = 10, message = "Valor minimo para depositos é de R$ 10,00")
    private BigDecimal amount;

    private LocalDateTime dateTime;

    @JsonIgnore
    public boolean isAmountNotValidForType() throws DepositException
    {
        if(this.amount == null && this.cashType == CashType.CASH)
        {
            throw new DepositException("Nenhum valor de depósito foi informado.");
        }

        return this.cashType == CashType.CASH && amount.doubleValue() % 2 != 0;
    }

    public boolean bluecoinFileIsEmpty()
    {
        return this.bluecoinFile == null || this.bluecoinFile.isEmpty();
    }
}