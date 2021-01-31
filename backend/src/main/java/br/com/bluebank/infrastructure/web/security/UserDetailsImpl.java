package br.com.bluebank.infrastructure.web.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.bluebank.domain.User.User;

@SuppressWarnings("serial")
public class UserDetailsImpl implements UserDetails 
{
    private String username;
    private String password;
    private String name;

    public UserDetailsImpl(User user) 
    {
        this.username = user.getCpfCnpj();
        this.password = user.getPassword();
        this.name = user.getName();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() 
    {
        return AuthorityUtils.NO_AUTHORITIES;
    }

    @Override
    public String getPassword() 
    {
        return this.password;
    }

    @Override
    public String getUsername() 
    {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() 
    {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() 
    {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() 
    {
        return true;
    }

    @Override
    public boolean isEnabled()
    {
        return true;
    }

    public String getName() 
    {
        return name;
    }
}