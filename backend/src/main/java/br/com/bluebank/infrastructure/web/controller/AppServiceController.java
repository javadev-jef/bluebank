package br.com.bluebank.infrastructure.web.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.bluebank.application.service.MovementService;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Movement.StatementFilter;
import br.com.bluebank.domain.Movement.StatementResponse;

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
    public ResponseEntity<List<Account>> getAccountTypes()
    {
        Integer userId = 1;
        return ResponseEntity.ok(accountRepository.findByUser_Id(userId));
    }

    @PostMapping(path = "/statement")
    public ResponseEntity<StatementResponse> getStatement(@Valid @RequestBody StatementFilter stf)
    {
        StatementResponse str = movementService.getStatementData(stf);
        return ResponseEntity.ok(str);
    }
}