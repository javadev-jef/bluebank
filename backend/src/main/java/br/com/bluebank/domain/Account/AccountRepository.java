package br.com.bluebank.domain.Account;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.com.bluebank.domain.Account.Account.AccountType;

@RepositoryRestResource(exported = false)
public interface AccountRepository extends JpaRepository<Account, String>
{
    public Account findByNumAccount(String numAccount);
    
    @Query("SELECT MAX(CAST(a.numAccount AS long)) FROM Account AS a")
    public String findLastAccount();

    @Query("SELECT a FROM Account AS a WHERE a.user.cpfCnpj = ?1")
    public List<Account> findByUsername(String username);

    @Query("SELECT a FROM Account AS a WHERE a.user.cpfCnpj = ?1 AND a.accountType = ?2")
    public Optional<Account> findByUsernameAndAccountType(String id, AccountType accountType);

    @Query("SELECT a.numAccount FROM Account AS a WHERE a.user.cpfCnpj = ?1 AND a.accountType = ?2")
    public String obtainNumAccountByParams(String username, AccountType accountType);

    @Query("SELECT a.user.name FROM Account AS a WHERE a.numAccount = ?1")
    public String findNameByNumAccount(String numAccount);
}