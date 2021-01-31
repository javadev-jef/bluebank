package br.com.bluebank.infrastructure.web.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.bluebank.domain.Account.Account;
import br.com.bluebank.domain.Account.AccountRepository;
import br.com.bluebank.domain.User.User;
import br.com.bluebank.domain.User.UserLogon;
import br.com.bluebank.domain.User.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService 
{
    private UserRepository userRepository;
    private AccountRepository accountRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository, AccountRepository accountRepository) 
    {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String jsonStr) throws UsernameNotFoundException 
    {
        try 
        {
            ObjectMapper mapper = new ObjectMapper();
            UserLogon userLogon = mapper.readValue(jsonStr, UserLogon.class);
            
            User user = null;
            switch (userLogon.getLogonType()) 
            {
                case CPF_CNPJ:
                {
                    user = userRepository.findByCpfCnpj(userLogon.getUsername()).orElse(null);
                    break;
                }
                case NUM_ACCOUNT:
                {
                    Account account = accountRepository.findById(userLogon.getUsername()).orElse(null);
                    user = account != null ? account.getUser() : null;
                    break;
                }
                default:
                {
                    String msg = "O LogonType "+userLogon.getLogonType()+" não é valido.";
                    throw new UsernameNotFoundException(msg);
                }
            }
            
            if(user == null)
            {
                throw new UsernameNotFoundException(userLogon.getUsername());
            }

            return new UserDetailsImpl(user);
        } 
        catch (JsonProcessingException e) 
        {
			throw new RuntimeException(e);
		}
    }
}