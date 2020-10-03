package br.com.bluebank.domain.Movement;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.User.User;

public interface MovementRepository extends PagingAndSortingRepository<Movement, Integer>
{
    @Query("SELECT SUM(s.finalAmount) FROM Movement AS s WHERE s.account.numAccount = ?1 AND s.scheduled = false")
    public BigDecimal findBalanceByNumAccount(String numAccount);   

    @Query("SELECT m FROM Movement AS m WHERE m.scheduled = true AND CAST(m.date AS LocalDate) = ?1")
    public List<Movement> findAllScheduledByDate(LocalDate date);

    @Query("SELECT m FROM Movement AS m WHERE m.scheduled = true AND CAST(m.date AS LocalDate) < ?1")
    public List<Movement> findAllFailedMovementScheduledByDate(LocalDate date);

    @Query("SELECT m FROM Movement AS m WHERE m.account.accountType = ?1 AND m.scheduled = false AND m.account.user = ?2 AND CAST(m.date AS LocalDate) BETWEEN ?3 AND ?4")
    public List<Movement> findAllByStatementFilter(AccountType accountType, User user, LocalDate initialDate, LocalDate finalDate);
}