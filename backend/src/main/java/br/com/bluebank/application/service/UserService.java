package br.com.bluebank.application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.Account.AccountType;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.User.User;
import br.com.bluebank.domain.User.UserRepository;
import br.com.bluebank.utils.StringUtils;

@Service
public class UserService 
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public User save(User user)
    {
        user = userRepository.save(user);

        Account account;
        String lastNumAccount;

        for(int i=0; i<=1; i++)
        {
            account = new Account();
            lastNumAccount = accountRepository.findLastAccount();
            account.setNumAccount(lastNumAccount);
            account.setAccountType(AccountType.values()[i]);
            account.setUser(user);
            accountRepository.save(account);
        }

       return user;
    }

    @Transactional
    public User update(User user)
    {
        if(StringUtils.isEmpty(user.getPassword()))
        {
            String userPassword = userRepository.findUserPasswordById(user.getId());
            user.setPassword(userPassword);
        }
        
        return userRepository.save(user);
    }

    public User findById(Integer id)
    {
        User user = userRepository.findById(id).orElseThrow();
        user.setPassword(null);

        return user;
    }
}