package br.com.bluebank.infrastructure.web.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.bluebank.application.service.DepositService;
import br.com.bluebank.application.service.MovementService;
import br.com.bluebank.application.service.TransferService;
import br.com.bluebank.application.service.UserService;
import br.com.bluebank.application.service.WithdrawService;
import br.com.bluebank.application.service.exception.BlueBankException;
import br.com.bluebank.application.service.exception.DepositException;
import br.com.bluebank.application.service.exception.MyselfTransferException;
import br.com.bluebank.application.service.exception.WithdrawException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Movement.DepositForm;
import br.com.bluebank.domain.Movement.StatementFilter;
import br.com.bluebank.domain.Movement.StatementResponse;
import br.com.bluebank.domain.Movement.TransferForm;
import br.com.bluebank.domain.Movement.WithdrawForm;
import br.com.bluebank.domain.User.User;
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

    @Autowired
    private UserService userService;

    @Autowired
    private TransferService transferService;

    @Autowired
    private DepositService depositService;

    @Autowired
    private WithdrawService withdrawService;

    @GetMapping(path = "/user/account/{accountType}/balance")
    public ResponseEntity<Map<String, BigDecimal>> getUserBalance(@PathVariable("accountType") AccountType accountType) 
    {
        // TODO: Only test, must be the logged user
        Integer userId = 1;
        String numAccount = accountRepository.obtainNumAccountByParams(userId, accountType);

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
        List<Account> userAccounts = accountRepository.findByUser_Id(userId);

        return ResponseEntity.ok(DefaultResponse.fromData(userAccounts));
    }

    @PostMapping(path = "/statement")
    public ResponseEntity<StatementResponse> getStatement(@Valid @RequestBody StatementFilter stf) 
    {
        StatementResponse str = movementService.getStatementData(stf);
        return ResponseEntity.ok(str);
    }

    @PostMapping(path = "user/transfer")
    public ResponseEntity<TransferForm> transfer(@Valid @RequestBody TransferForm transfer) throws BlueBankException
    {
        // TODO: Only test, must be the logged user
        Integer userId = 1;
        Account userAccount = accountRepository.findByUser_idAndAccountType(userId, transfer.getUserAccountType()).orElseThrow();

        if(userAccount.getNumAccount().equals(transfer.getNumAccount())) 
        {
            throw new MyselfTransferException();
        }

        transferService.save(transfer, userAccount);
        return ResponseEntity.ok(transfer);
    }

    @PostMapping(path = "/user/withdraw", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> withdraw(@Valid @RequestBody WithdrawForm wform) throws BlueBankException 
    {

        if(wform.isAmountNotValidForType()) 
        {
            String msg = "Infelizmente não é possivel sacar moedas, somente notas.";

            Map<String, String> error = new LinkedHashMap<>();
            error.put("amount", msg);

            throw new WithdrawException(error, msg);
        }

        // TODO: Only test, must be the logged user
        Integer userId = 1;
        Optional<byte[]> response = withdrawService.save(wform, userId);

        return response.isPresent() ? ResponseEntity.ok(response.get()) : ResponseEntity.ok().build();
    }

    @PostMapping(path = "/user/account/deposit")
    public ResponseEntity<DepositForm> deposit(@Valid @ModelAttribute DepositForm dForm) throws BlueBankException
    {  
        if(dForm.isAmountNotValidForType()) 
        {
            String msg = "Não é permitido o depósito de moedas, somente notas";

            Map<String, String> error = new LinkedHashMap<>();
            error.put("amount", msg);

            throw new DepositException(error, msg);
        }

        depositService.save(dForm);

        dForm.setDateTime(LocalDateTime.now());
        dForm.setBluecoinFile(null);

        return ResponseEntity.ok(dForm);
    }

    @GetMapping(path = "/user/profile")
    public ResponseEntity<User> profile()
    {
        // TODO: Only test, must be the logged user
        Integer userId = 1;
        User user = userService.findById(userId);

        return ResponseEntity.ok(user);
    }

    @PutMapping(path = "/user/profile/update")
    public void updateProfile(@Valid @RequestBody User user)
    {
        // TODO: Only test, must be the logged user
        Integer userId = 1;
        user.setId(userId);
        user = userService.update(user);
    }
}