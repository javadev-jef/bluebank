package br.com.bluebank.domain.account;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.User.User;
import br.com.bluebank.domain.User.User.PersonType;
import br.com.bluebank.utils.StringUtils;
import br.com.bluebank.domain.User.UserRepository;

@DataJpaTest
@ActiveProfiles(value = "test")
public class AccountRepositoryTest 
{
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void save()
    {
        assertNotNull(accountRepository);
        assertNotNull(userRepository);

        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(3131307);
        user.setCpfCnpj("44570645054");
        user.setEmail("usuario@email.com.br");
        user.setName("Jose Carlos Augusto");
        user.setPassword("654321");
        user.encryptPassword();
        user.setPersonType(PersonType.CPF);
        user.setStateId(31);
        userRepository.saveAndFlush(user);

        assertNotNull(user.getId());

        Account account = new Account();
        String lastNumAccount = accountRepository.findLastAccount();
        account.setNumAccount(lastNumAccount);
        account.setAccountType(AccountType.CHECKING_ACCOUNT);
        account.setUser(user);
        account.setBalance(BigDecimal.ZERO);
        accountRepository.saveAndFlush(account);

        assertNotNull(account.getNumAccount());

        Account accountBD = accountRepository.findByNumAccount(account.getNumAccount());
        assertNotNull(accountBD);
        assertEquals(user.getId(), accountBD.getUser().getId());
    }

    @Test
    public void findByNumAccount()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(3131307);
        user.setCpfCnpj("44570645054");
        user.setEmail("marcos@email.com.br");
        user.setName("Marcos Felipe");
        user.setPassword("95174679");
        user.encryptPassword();
        user.setPersonType(PersonType.CPF);
        user.setStateId(31);
        userRepository.saveAndFlush(user);

        Account account = new Account();
        String lastNumAccount = accountRepository.findLastAccount();
        account.setNumAccount(lastNumAccount);
        account.setAccountType(AccountType.SAVINGS_ACCOUNT);
        account.setUser(user);
        account.setBalance(BigDecimal.ZERO);
        accountRepository.saveAndFlush(account);

        String numAccountPersisted = account.getNumAccount();

        Account accountBD = accountRepository.findByNumAccount(numAccountPersisted);
        assertNotNull(accountBD);
        assertEquals(numAccountPersisted, accountBD.getNumAccount());
    }

    @Test
    public void findLastAccount()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(3131);
        user.setCpfCnpj("19106416004");
        user.setEmail("pietro@email.com.br");
        user.setName("Pietro Silva");
        user.setPassword("951357");
        user.encryptPassword();
        user.setPersonType(PersonType.CPF);
        user.setStateId(22);
        userRepository.saveAndFlush(user);

        Account account = new Account();
        String lastNumAccount = accountRepository.findLastAccount();
        account.setNumAccount(lastNumAccount);
        account.setAccountType(AccountType.SAVINGS_ACCOUNT);
        account.setUser(user);
        account.setBalance(BigDecimal.ZERO);
        accountRepository.saveAndFlush(account);

        lastNumAccount = accountRepository.findLastAccount();

        assertEquals(account.getNumAccount(), lastNumAccount);
    }

    @Test
    public void findByUsername()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(3167);
        user.setCpfCnpj("32946332039");
        user.setEmail("cassia@email.com.br");
        user.setName("Cassia Maria");
        user.setPassword("7419834");
        user.encryptPassword();
        user.setPersonType(PersonType.CPF);
        user.setStateId(156);
        userRepository.saveAndFlush(user);

        Account account;

        for(int i=0; i<=1; i++)
        {
            String lastNumAccount = accountRepository.findLastAccount();

            account = new Account();
            account.setNumAccount(lastNumAccount);
            account.setAccountType(AccountType.values()[i]);
            account.setUser(user);
            account.setBalance(BigDecimal.ZERO);
            accountRepository.saveAndFlush(account);
        }

        String username = user.getCpfCnpj();

        List<Account> accounts = accountRepository.findByUsername(username);
        Assertions.assertThat(accounts).hasSize(2);
    }

    @Test
    public void findByUsernameAndAccountType()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(753);
        user.setCpfCnpj("27144782045");
        user.setEmail("geni@email.com.br");
        user.setName("Geni Maria");
        user.setPassword("356489");
        user.encryptPassword();
        user.setPersonType(PersonType.CPF);
        user.setStateId(951);
        userRepository.saveAndFlush(user);

        Account account;

        for(int i=0; i<=1; i++)
        {
            String lastNumAccount = accountRepository.findLastAccount();

            account = new Account();
            account.setNumAccount(lastNumAccount);
            account.setAccountType(AccountType.values()[i]);
            account.setUser(user);
            account.setBalance(BigDecimal.ZERO);
            accountRepository.saveAndFlush(account);
        }

        String username = user.getCpfCnpj();

        Optional<Account> accountOptional = accountRepository.findByUsernameAndAccountType(username, AccountType.SAVINGS_ACCOUNT);
        assertTrue(accountOptional.isPresent());

        account = accountOptional.get();
        assertEquals(user.getId(), account.getUser().getId());
    }

    @Test
    public void obtainNumAccountByParams()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(159);
        user.setCpfCnpj("02162680017");
        user.setEmail("joao@email.com.br");
        user.setName("João Pedro");
        user.setPassword("176202");
        user.encryptPassword();
        user.setPersonType(PersonType.CPF);
        user.setStateId(75);
        userRepository.saveAndFlush(user);

        Account account;

        for(int i=0; i<=1; i++)
        {
            String lastNumAccount = accountRepository.findLastAccount();

            account = new Account();
            account.setNumAccount(lastNumAccount);
            account.setAccountType(AccountType.values()[i]);
            account.setUser(user);
            account.setBalance(BigDecimal.ZERO);
            accountRepository.saveAndFlush(account);
        }

        String username = user.getCpfCnpj();

        String numAccount = accountRepository.obtainNumAccountByParams(username, AccountType.CHECKING_ACCOUNT);
        assertFalse(StringUtils.isEmpty(numAccount));

        Account accountDB = accountRepository.findByNumAccount(numAccount);
        assertNotNull(accountDB);
    }

    @Test
    public void findNameByNumAccount()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(14);
        user.setCpfCnpj("27538371044");
        user.setEmail("alice@email.com.br");
        user.setName("Alice Fonseca");
        user.setPassword("791356");
        user.encryptPassword();
        user.setPersonType(PersonType.CPF);
        user.setStateId(26);
        userRepository.saveAndFlush(user);

        Account account = null;

        for(int i=0; i<=1; i++)
        {
            String lastNumAccount = accountRepository.findLastAccount();

            account = new Account();
            account.setNumAccount(lastNumAccount);
            account.setAccountType(AccountType.values()[i]);
            account.setUser(user);
            account.setBalance(BigDecimal.ZERO);
            accountRepository.saveAndFlush(account);
        }

        assertNotNull(account);

        String numAccount = account.getNumAccount();
        String userName = accountRepository.findNameByNumAccount(numAccount);

        assertFalse(StringUtils.isEmpty(userName));
    }
}