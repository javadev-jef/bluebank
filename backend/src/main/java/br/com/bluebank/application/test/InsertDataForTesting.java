package br.com.bluebank.application.test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import br.com.bluebank.application.service.MovementService;
import br.com.bluebank.application.service.TransferService;
import br.com.bluebank.application.service.UserService;
import br.com.bluebank.application.service.exception.BlueBankException;
import br.com.bluebank.application.service.exception.InsufficienteBalanceException;
import br.com.bluebank.application.service.exception.TransferException;
import br.com.bluebank.application.service.exception.ValidationException;
import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.domain.Movement.TransferForm;
import br.com.bluebank.domain.User.User;
import br.com.bluebank.domain.User.User.PersonType;
import br.com.bluebank.utils.MovementServiceUtils;

@Component
public class InsertDataForTesting 
{
    @Autowired
    private UserService userService;

    @Autowired
    private MovementService movementService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransferService transferService;

    @Value("${spring.profiles.active}")
    private String activeProfile;
    
    @Value("${spring.jpa.hibernate.ddl-auto}")
    private String dllMode;

    private final String CLASS_NAME = this.getClass().getSimpleName();

    private static final Logger logger = LoggerFactory.getLogger(InsertDataForTesting.class);

    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) throws BlueBankException 
    {
        if(activeProfile.toLowerCase().equals("dev") && dllMode.toLowerCase().equals("create-drop"))
        {
            logger.debug(CLASS_NAME.concat("...RUNNING"));

            User[] users = users();
            List<Account> allAccounts = new ArrayList<>();

            for (int i = 0; i <= (users.length - 1); i++) {
                // Fetch user accounts
                allAccounts = accountRepository.findByUsername(users[i].getCpfCnpj());

                Account[] array = new Account[allAccounts.size()];
                array = allAccounts.toArray(array);

                setMovements(array);
                allAccounts.clear();
            }

            setTransfers();

            logger.debug(CLASS_NAME.concat("...FINISHED"));
        }
    }

    /**
     * Adds the initial amount for all accounts
     * 
     * @param accounts : User accounts
     * @throws InsufficienteBalanceException
     */
    private void setMovements(Account[] accounts) throws InsufficienteBalanceException {
        Movement mv;
        for (int i = 0; i <= (accounts.length - 1); i++) 
        {
            mv = MovementServiceUtils.generateInitialMovement(accounts[i]);
            movementService.save(mv);
        }

        mv = new Movement();
        mv.setDate(LocalDateTime.now().plusSeconds(1));
        mv.setMovementType(MovementType.WITHDRAW);
        mv.setTempAmount(BigDecimal.valueOf(50));
        mv.setAccount(accounts[0]);
        movementService.save(mv);
    }

    private void setTransfers() throws TransferException, InsufficienteBalanceException {
        List<Account> accounts = accountRepository.findAll();
        Account fromAccount = accounts.get(0); // 08111
        Account toAccount = accounts.get(2); // 08113

        TransferForm t = new TransferForm();
        t.setAccountType(fromAccount.getAccountType());
        t.setNumAccount(toAccount.getNumAccount());
        t.setAccountType(toAccount.getAccountType());
        t.setPersonType(toAccount.getUser().getPersonType());
        t.setCpfCnpj(toAccount.getUser().getCpfCnpj());
        t.setAmount(BigDecimal.valueOf(20));
        t.setWhenToDo(LocalDate.now().plusDays(1));
        transferService.save(t, fromAccount);
    }

    private User[] users() throws ValidationException
    {
        List<User> users = new ArrayList<>();

        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(3131307);
        user.setCpfCnpj("44570645054");
        user.setEmail("usuario@email.com.br");
        user.setName("Jose Carlos Augusto");
        user.setPassword("654321");
        user.setPersonType(PersonType.CPF);
        user.setStateId(31);
        user = userService.save(user);
        users.add(user);

        user = new User();
        user.setBirthDate(LocalDate.now().minusYears(1));
        user.setCityId(4106902);
        user.setCpfCnpj("60721994000167");
        user.setEmail("empresa@email.com.br");
        user.setName("Empresa LTDA");
        user.setPassword("123456");
        user.setPersonType(PersonType.CNPJ);
        user.setStateId(41);
        user = userService.save(user);
        users.add(user);

        User[] array = new User[users.size()];
        return users.toArray(array);
    }
}