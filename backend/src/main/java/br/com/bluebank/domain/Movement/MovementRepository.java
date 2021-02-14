package br.com.bluebank.domain.Movement;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.Movement.Movement.MovementType;
import br.com.bluebank.domain.User.User;
@RepositoryRestResource(exported = false)
public interface MovementRepository extends PagingAndSortingRepository<Movement, Integer>
{
    @Query("SELECT SUM(s.finalAmount) FROM Movement AS s WHERE s.account.numAccount = ?1 AND s.scheduled = false")
    public BigDecimal findBalanceByNumAccount(String numAccount);   

    @Query("SELECT m FROM Movement AS m WHERE m.scheduled = true AND CAST(m.date AS LocalDate) = ?1")
    public List<Movement> findAllScheduledByDate(LocalDate date);

    @Query("SELECT m FROM Movement AS m WHERE m.scheduled = true AND CAST(m.date AS LocalDate) = ?1 AND m.movementType = ?2")
    public List<Movement> findScheduledByDateAndType(LocalDate date, MovementType type);

    @Query("SELECT m FROM Movement AS m WHERE m.scheduled = true AND CAST(m.date AS LocalDate) < ?1")
    public List<Movement> findAllFailedMovementScheduledByDate(LocalDate date);

    @Query("SELECT m FROM Movement AS m WHERE m.account.accountType = ?1 AND m.scheduled = false AND m.account.user = ?2 AND CAST(m.date AS LocalDate) BETWEEN ?3 AND ?4 ORDER BY m.sequence DESC")
    public List<Movement> findAllByStatementFilter(AccountType accountType, User user, LocalDate initialDate, LocalDate finalDate);

    @Query("SELECT MAX(m.numTransaction) FROM Movement AS m")
    public Long findLastNumTransaction();

    @Query("SELECT MAX(m.sequence) FROM Movement AS m")
    public Long findLastSequence();
}