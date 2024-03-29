package br.com.bluebank.application.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.bluebank.application.service.exception.InsufficienteBalanceException;
import br.com.bluebank.application.service.exception.NoAccountFoundException;
import br.com.bluebank.application.service.exception.TransferException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.domain.Movement.MovementRepository;
import br.com.bluebank.domain.Movement.TransferForm;
import br.com.bluebank.utils.MovementServiceUtils;

@Service
public class TransferService
{
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MovementRepository movementRepository;

    @Transactional(rollbackFor = Exception.class)
    public void save(TransferForm transfer, Account userAccount) throws InsufficienteBalanceException, TransferException 
    {
        Account fromAccount = userAccount;
        Account toAccount = accountRepository.findById(transfer.getNumAccount()).orElseThrow(NoAccountFoundException::new);

        Map<String, String> errors = checkAndValidateTransferData(transfer, toAccount);

        if (errors.size() > 0) 
        {
            throw new TransferException(errors, toAccount.getNumAccount());
        }

        String msgToAccount = "Transferência recebida de ";
        String msgFromAccount = "Transferência realizada para ";

        if (fromAccount.getUser().getId() == toAccount.getUser().getId()) 
        {
            msgToAccount += fromAccount.getAccountType().displayName;
            msgFromAccount += toAccount.getAccountType().displayName;
        } 
        else 
        {
            msgToAccount += fromAccount.getUser().getName();
            msgFromAccount += toAccount.getUser().getName();
        }

        msgFromAccount = transfer.hasDescription() ? transfer.getDescription() : msgFromAccount;

        LocalDateTime whenToDo = transfer.getWhenToDo().atTime(LocalTime.now());
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59);

        Long lastNumTransaction = movementRepository.findLastNumTransaction();
        Long lastSequence = movementRepository.findLastSequence();

        // Source Account
        Movement mvt = new Movement();
        mvt.setDescription(msgFromAccount);
        mvt.setDate(whenToDo);
        mvt.setMovementType(MovementType.TRANSFER_SOURCE);
        mvt.setTempAmount(transfer.getAmount());
        mvt.setScheduled(whenToDo.isAfter(endOfDay));
        mvt.setAccount(fromAccount);
        mvt.setNumTransaction(lastNumTransaction);
        mvt.setSequence(lastSequence);
        mvt = MovementServiceUtils.prepareToSave(mvt);
        movementRepository.save(mvt);

        if(!mvt.getScheduled())
        {
            accountRepository.save(mvt.getAccount());
        }

        // Target account
        mvt = new Movement();
        mvt.setDescription(msgToAccount);
        mvt.setDate(whenToDo);
        mvt.setMovementType(MovementType.TRANSFER_TARGET);
        mvt.setTempAmount(transfer.getAmount());
        mvt.setScheduled(whenToDo.isAfter(endOfDay));
        mvt.setAccount(toAccount);
        mvt.setNumTransaction(lastNumTransaction);
        mvt.setSequence(++lastSequence);
        mvt = MovementServiceUtils.prepareToSave(mvt);
        movementRepository.save(mvt);

        if(!mvt.getScheduled())
        {
            accountRepository.save(mvt.getAccount());
        }
    }

    private Map<String, String> checkAndValidateTransferData(TransferForm transfer, Account toAccount) 
    {
        Map<String, String> errors = new LinkedHashMap<>();

        if (toAccount.getAccountType() != transfer.getAccountType()) 
        {
            errors.put("accountType", "O tipo da conta informada não corresponde ao tipo do destino");
        }

        if (toAccount.getUser().getPersonType() != transfer.getPersonType()) 
        {
            errors.put("personType", "o tipo de pessoa informado não corresponde ao tipo do destino");
        }

        if (!toAccount.getUser().getCpfCnpj().equals(transfer.getCpfCnpj())) 
        {
            errors.put("cpfCnpj", "O CPF/CNPJ informado não corresponde ao tipo do destino");
        }

        return errors;
    }
}