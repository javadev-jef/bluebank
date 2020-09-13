package br.com.bluebank.infrastructure.web.controller;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.bluebank.application.service.InsufficienteBalanceException;
import br.com.bluebank.application.service.MovementService;
import br.com.bluebank.application.service.MyselfTransferException;
import br.com.bluebank.application.service.TransferException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Movement.StatementFilter;
import br.com.bluebank.domain.Movement.StatementResponse;
import br.com.bluebank.domain.Movement.Transfer;
import br.com.bluebank.domain.User.User.PersonType;
import br.com.bluebank.infrastructure.web.DefaultResponse;

@CrossOrigin
@RestController
@RequestMapping(path = "/api")
public class AppServiceController 
{
    @Autowired
    private MovementService movementService;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping(path = "/user/accounts")
    public ResponseEntity<List<Account>> getUserAccountTypes() 
    {
        Integer userId = 1;
        return ResponseEntity.ok(accountRepository.findByUser_Id(userId));
    }

    @GetMapping(path = "/user/account/{numAccount}/balance")
    public ResponseEntity<Map<String, BigDecimal>> getUserBalance(@PathVariable("numAccount") String numAccount)
    {
        BigDecimal balance = movementService.getUserBalance(numAccount);

        Map<String, BigDecimal> map = new LinkedHashMap<>();
        map.put("balance", balance);

        return ResponseEntity.ok(map);
    }

    @GetMapping(path = "/default-response")
    public ResponseEntity<DefaultResponse> getDefaultResponse() 
    {
        // TODO: Only test, must be the logged user
        Integer userId = 1;

        AccountType[] accountTypes = Account.AccountType.values();
        PersonType[] personTypes = PersonType.values();

        List<Account> userAccounts = accountRepository.findByUser_Id(userId);

        return ResponseEntity.ok(DefaultResponse.fromData(userAccounts, accountTypes, personTypes));
    }

    @PostMapping(path = "/statement")
    public ResponseEntity<StatementResponse> getStatement(@Valid @RequestBody StatementFilter stf)
    {
        StatementResponse str = movementService.getStatementData(stf);
        return ResponseEntity.ok(str);
    }

    @PostMapping(path = "user/transfer")
    public ResponseEntity<Transfer> transfer(@Valid @RequestBody Transfer transfer)
            throws TransferException, MyselfTransferException, InsufficienteBalanceException {

        if(transfer.isTransferToSameAccount())
        {
            throw new MyselfTransferException();
        }

        movementService.transfer(transfer);
        return ResponseEntity.ok(transfer);
    }
}