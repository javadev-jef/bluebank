package br.com.bluebank.application.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.bluebank.application.service.exception.ValidationException;
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
    public User save(User user) throws ValidationException
    {
        Map<String, String> errors = checkAndValidateUserAttributes(user);

        if(errors.size() > 0)
        {
            throw new ValidationException(errors);
        }
        
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

    private Map<String, String> checkAndValidateUserAttributes(User user)
    {
        Map<String, String> errors = new LinkedHashMap<>();
        List<User> usersBD = userRepository.findByEmailOrCpfCnpj(user.getEmail(), user.getCpfCnpj());

        if(user.isNotEmptyPassword())
        {
            errors.put("password", "Nenhuma senha foi informada");
        }

        if(usersBD != null && !usersBD.isEmpty())
        {
            for(User userBD : usersBD)
            {
                if(!userBD.equals(user))
                {
                    if(userBD.getCpfCnpj().equals(user.getCpfCnpj()))
                    {
                        errors.put("cpfCnpj", "O CPF/CNPJ informado já pertence a um usuário do sistema");
                    }

                    if(userBD.getEmail().equals(user.getEmail()))
                    {
                        errors.put("email", "O email informado já esta vinculado a um cadastro do sistema");
                    }
                }
            }
        }

        return errors;
    }

    @Transactional
    public User update(User user) throws ValidationException
    {
        if(StringUtils.isEmpty(user.getPassword()))
        {
            String userPassword = userRepository.findUserPasswordById(user.getId());
            user.setPassword(userPassword);
        }

        Map<String, String> errors = checkAndValidateUserAttributes(user);
        if(errors.size() > 0)
        {
            throw new ValidationException(errors);
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