package br.com.bluebank.domain.Account;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AccountRepository extends JpaRepository<Account, String>
{
    @Query("SELECT MAX(a.numAccount) FROM Account AS a")
    public String findLastAccount();

    public List<Account> findByUser_Id(Integer id);

    public Account findByUser_idAndNumAccount(Integer id, String numAccount);
}