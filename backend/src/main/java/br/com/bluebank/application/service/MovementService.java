package br.com.bluebank.application.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.domain.Movement.MovementRepository;
import br.com.bluebank.domain.Movement.StatementFilter;
import br.com.bluebank.domain.Movement.StatementResponse;
import br.com.bluebank.domain.Movement.Transfer;

@Service
public class MovementService 
{
    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private AccountRepository accountRepository;

    public BigDecimal getUserBalance(String numAccount)
    {
        return movementRepository.findBalanceByNumAccount(numAccount);
    }

    public StatementResponse getStatementData(StatementFilter stf) 
    {
        Account accountUser = accountRepository.findByUser_idAndNumAccount(1, stf.getNumAccount());
        List<Movement> mvts = movementRepository.findAllByStatementFilter(accountUser.getAccountType(), accountUser.getUser(), stf.getInitialDate(), stf.getFinalDate());
        
        BigDecimal t = mvts.stream().map(x -> x.getFinalAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
        return StatementResponse.fromData(mvts, t);
    }

    @Transactional
    public byte[] save(Movement mv) throws InsufficienteBalanceException
    {
        String numAccount = mv.getAccount().getNumAccount();

        BigDecimal balanceDB = movementRepository.findBalanceByNumAccount(numAccount);
        BigDecimal currentBalance = balanceDB != null ? balanceDB : BigDecimal.ZERO;

        mv.setFinalAmount(mv.getTempAmount());
        mv.setBalance(currentBalance);
        mv.setDescription(mv.getDescription() == null ? getDefaultDescription(mv.getMovementType()) : mv.getDescription());

        movementRepository.save(mv);

        if(mv.getMovementType() == MovementType.WITHDRAW)
        {
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("amount", mv.getTempAmount());
            dataMap.put("accountType", mv.getAccount().getAccountType());

            try
            {
                String jsonStr = new ObjectMapper().writeValueAsString(dataMap);
                String jsonEncoded = Base64.getEncoder().encodeToString(jsonStr.getBytes());
                
                WebClient webClient = 
                    WebClient.create("https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0087D0&bgcolor=fff&data="+jsonEncoded);
                
                return webClient.get()
                    .accept(MediaType.IMAGE_PNG)
                    .retrieve()
                    .bodyToMono(byte[].class)
                    .block();
            }
            catch(JsonProcessingException ex)
            {
                ex.printStackTrace();
            }
        }

        return null;
    }

    @Transactional
    public void transfer(Transfer transfer) throws TransferException, InsufficienteBalanceException
    {
        Account fromAccount = accountRepository.findById(transfer.getNumAccountUser()).orElseThrow();
        Account toAccount = accountRepository.findById(transfer.getNumAccount()).orElseThrow(NoAccountFoundException::new);

        Map<String, String> errors = checkAndValidateTransferData(transfer, toAccount);
        
        if(errors.size() > 0)
        {
            throw new TransferException(errors, toAccount.getNumAccount());
        }

        String msgToAccount = "Transferência recebida de ";
        String msgFromAccount = "Transferência realizada para ";

        if(fromAccount.getUser().getId() == toAccount.getUser().getId())
        {
            msgToAccount += fromAccount.getAccountType().displayName;
            msgFromAccount += toAccount.getAccountType().displayName;
        }
        else{
            msgToAccount += fromAccount.getUser().getName();
            msgFromAccount += toAccount.getUser().getName();
        }

        msgFromAccount = transfer.hasDescription() ? transfer.getDescription() : msgFromAccount;

        LocalDateTime whenToDo = transfer.getWhenToDo().atTime(LocalTime.now());
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59);

        // Source Account
        Movement mvt = new Movement();
        mvt.setDescription(msgFromAccount);
        mvt.setDate(whenToDo);
        mvt.setMovementType(MovementType.TRANSFER_SOURCE);
        mvt.setTempAmount(transfer.getAmount());
        mvt.setScheduled(whenToDo.isAfter(endOfDay));
        mvt.setAccount(fromAccount);
        this.save(mvt);

        // Target account
        mvt = new Movement();
        mvt.setDescription(msgToAccount);
        mvt.setDate(whenToDo);
        mvt.setMovementType(MovementType.TRANSFER_TARGER);
        mvt.setTempAmount(transfer.getAmount());
        mvt.setScheduled(whenToDo.isAfter(endOfDay));
        mvt.setAccount(toAccount);
        this.save(mvt);
    }

    private Map<String, String> checkAndValidateTransferData(Transfer transfer, Account toAccount)
    {
        Map<String, String> errors = new LinkedHashMap<>();

        if(toAccount.getAccountType() != transfer.getAccountType())
        {
            errors.put("accountType", "O tipo da conta informada não corresponde ao tipo do destino");
        }

        if(toAccount.getUser().getPersonType() != transfer.getPersonType())
        {
            errors.put("personType", "o tipo de pessoa informado não corresponde ao tipo do destino");
        }

        if(!toAccount.getUser().getCpfCnpj().equals(transfer.getCpfCnpj()))
        {
            errors.put("cpfCnpj", "O CPF/CNPJ informado não corresponde ao tipo do destino");
        }
    
        return errors;
    }

    private String getDefaultDescription(MovementType movementType)
    {
        Map<MovementType, String> descriptions = new HashMap<>();
        descriptions.put(MovementType.DEPOSIT, "Depósito realizado via terminal virtual");
        descriptions.put(MovementType.BONUS, "Bonificação por abertura de conta BlueBank");
        descriptions.put(MovementType.WITHDRAW, "Saque realizado via terminal virtual");

        return descriptions.get(movementType);
    }
}