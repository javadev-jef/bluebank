package br.com.bluebank.infrastructure.web.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.bluebank.application.service.BlacklistService;
import br.com.bluebank.application.service.DepositService;
import br.com.bluebank.application.service.MovementService;
import br.com.bluebank.application.service.TransferService;
import br.com.bluebank.application.service.UserService;
import br.com.bluebank.application.service.WithdrawService;
import br.com.bluebank.application.service.exception.BlueBankException;
import br.com.bluebank.application.service.exception.DepositException;
import br.com.bluebank.application.service.exception.MyselfTransferException;
import br.com.bluebank.application.service.exception.TransactionException;
import br.com.bluebank.application.service.exception.ValidationException;
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
import br.com.bluebank.infrastructure.web.security.Utils.JWTConstantsUtils;
import br.com.bluebank.infrastructure.web.security.Utils.JWTTokenUtils;
import br.com.bluebank.utils.TransactionUtils;

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

    @Autowired
    private BlacklistService blacklistService;

    @GetMapping(path = "/user/account/{accountType}/balance")
    public ResponseEntity<Map<String, BigDecimal>> getAccountBalance(@PathVariable("accountType") AccountType accountType) 
    {
        String username = JWTTokenUtils.loggedUsername();

        Account account = accountRepository.findByUsernameAndAccountType(username, accountType).orElseThrow();
        BigDecimal balance = account.getBalance();

        Map<String, BigDecimal> map = new LinkedHashMap<>();
        map.put("balance", balance);

        return ResponseEntity.ok(map);
    }

    @GetMapping(path = "/user/account/balance")
    public ResponseEntity<List<Account>> getAccountBalance() 
    {
        String username = JWTTokenUtils.loggedUsername();
        User user = userService.findByUsername(username);

        return ResponseEntity.ok(user.getAccounts());
    }

    @GetMapping(path = "/server/default-response/{accessType}")
    public ResponseEntity<DefaultResponse> getDefaultResponse(@PathVariable("accessType") String accessType) 
    {
        if(accessType.equals("private"))
        {
            String username = JWTTokenUtils.loggedUsername();
            List<Account> userAccounts = accountRepository.findByUsername(username);

            return ResponseEntity.ok(DefaultResponse.fromData(userAccounts));
        }
        else if(accessType.equals("public"))
        {
            return ResponseEntity.ok(DefaultResponse.fromData(null));
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping(path = "/user/account/statement")
    public ResponseEntity<StatementResponse> getStatement(@Valid @RequestBody StatementFilter stf) 
    {
        String username = JWTTokenUtils.loggedUsername();
        StatementResponse str = movementService.getStatementData(stf, username);
        return ResponseEntity.ok(str);
    }

    @PostMapping(path = "/user/account/transfer")
    public ResponseEntity<TransferForm> transfer(@Valid @RequestBody TransferForm transfer) throws BlueBankException
    {
        String username = JWTTokenUtils.loggedUsername();
        Account userAccount = accountRepository.findByUsernameAndAccountType(username, transfer.getUserAccountType()).orElseThrow();

        if(userAccount.getNumAccount().equals(transfer.getNumAccount())) 
        {
            throw new MyselfTransferException();
        }

        transferService.save(transfer, userAccount);
        return ResponseEntity.ok(transfer);
    }

    @PostMapping(path = "/user/account/withdraw", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> withdraw(@Valid @RequestBody WithdrawForm wForm) throws BlueBankException
    {
        try 
        {
			TransactionUtils.validateAmountByCashType(wForm.getAmount(), wForm.getCashType());
        } 
        catch (TransactionException e) 
        {
			throw new WithdrawException(e.getErrors(), e.getMessage());
		}

        String username = JWTTokenUtils.loggedUsername();
        Optional<byte[]> response = withdrawService.save(wForm, username);

        return response.isPresent() ? ResponseEntity.ok(response.get()) : ResponseEntity.ok().build();
    }

    @PostMapping(path = "/user/account/deposit")
    public ResponseEntity<DepositForm> deposit(@Valid @ModelAttribute DepositForm dForm) throws BlueBankException
    {  
        try 
        {
			TransactionUtils.validateAmountByCashType(dForm.getAmount(), dForm.getCashType());
        } 
        catch (TransactionException e) 
        {
			throw new DepositException(e.getErrors(), e.getMessage());
		}

        depositService.save(dForm);

        dForm.setDateTime(LocalDateTime.now());
        dForm.setBluecoinFile(null);

        return ResponseEntity.ok(dForm);
    }

    @GetMapping(path = "/user/profile")
    public ResponseEntity<User> profile()
    {
        String username = JWTTokenUtils.loggedUsername();
        User user = userService.findByUsername(username);

        return ResponseEntity.ok(user);
    }

    @PutMapping(path = "/user/profile/update")
    public void updateProfile(@Valid @RequestBody User newUser) throws ValidationException
    {
        String username = JWTTokenUtils.loggedUsername();
        newUser = userService.update(newUser, username);
    }

    @PostMapping(path = "/user/register")
    @ResponseStatus(value = HttpStatus.CREATED)
    public void registerUser(@Valid @RequestBody User newUser) throws ValidationException
    {
        userService.save(newUser);
    }

    @DeleteMapping(value = "/user/logout")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request)
    {
        String token = request.getHeader(JWTConstantsUtils.AUTH_HEADER);

        blacklistService.save(token);
    }

    @GetMapping(value = "/account/fetchFavoredName/{numAccount}")
    public ResponseEntity<String> fetchFavoredName(@PathVariable("numAccount") String numAccount)
    {
        String name = accountRepository.findNameByNumAccount(numAccount);
        return ResponseEntity.status(name != null ? HttpStatus.OK : HttpStatus.NOT_FOUND).body(name);
    }
}