package br.com.bluebank.domain.movement;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.MovementRepository;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.domain.User.User;
import br.com.bluebank.domain.User.UserRepository;
import br.com.bluebank.domain.User.User.PersonType;
import br.com.bluebank.utils.MovementServiceUtils;

@DataJpaTest
@ActiveProfiles(value = "test")
public class MovementRepositoryTest 
{
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovementRepository movementRepository;

    @Test
    public void findAllByStatementFilter() throws Exception
    {
        assertNotNull(userRepository);
        assertNotNull(accountRepository);
        assertNotNull(movementRepository);

        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(3167);
        user.setCpfCnpj("21678788007");
        user.setEmail("marcia@email.com.br");
        user.setName("Marcia Rocha");
        user.setPassword("75.167+*");
        user.encryptPassword();
        user.setPersonType(PersonType.CPF);
        user.setStateId(156);
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

        Long lastNumTransaction = movementRepository.findLastNumTransaction();
        Long lastSequence = movementRepository.findLastSequence();
        
        Movement mvd = new Movement();
        mvd.setAccount(account);
        mvd.setDate(LocalDateTime.now());
        mvd.setTempAmount(BigDecimal.valueOf(15).setScale(2));
        mvd.setScheduled(false);
        mvd.setMovementType(MovementType.DEPOSIT);
        mvd.setNumTransaction(lastNumTransaction);
        mvd.setSequence(lastSequence);
        mvd = MovementServiceUtils.prepareToSave(mvd);
        mvd = movementRepository.save(mvd);

        assertNotNull(mvd.getId());

        List<Movement> mvmts = movementRepository.findAllByStatementFilter(AccountType.CHECKING_ACCOUNT, user, LocalDate.now(), LocalDate.now());
        Assertions.assertThat(mvmts).hasSize(1);

        assertEquals(mvd.getMovementType(), mvmts.get(0).getMovementType());
    }
}