package br.com.bluebank.domain.Account;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.bluebank.domain.Account.Account.AccountType;

public interface AccountRepository extends JpaRepository<Account, String>
{
    @Query("SELECT MAX(CAST(a.numAccount AS long)) FROM Account AS a")
    public String findLastAccount();

    public List<Account> findByUser_Id(Integer id);

    public Account findByUser_idAndNumAccount(Integer id, String numAccount);

    public Optional<Account> findByUser_idAndAccountType(Integer id, AccountType accountType);

    @Query("SELECT a.numAccount FROM Account AS a WHERE a.user.id = ?1 AND a.accountType = ?2")
    public String obtainNumAccountByParams(Integer id, AccountType accountType);

    @Query("SELECT SUM(m.finalAmount) FROM Movement AS m JOIN m.account AS a WHERE a.id = ?1")
    public BigDecimal findBalanceByNumAccount(String numAccount);
}