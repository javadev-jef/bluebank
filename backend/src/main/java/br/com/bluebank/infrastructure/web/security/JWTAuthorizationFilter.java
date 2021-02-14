package br.com.bluebank.infrastructure.web.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import br.com.bluebank.application.service.exception.BlockedTokenException;
import br.com.bluebank.infrastructure.web.security.Utils.JWTConstantsUtils;
import br.com.bluebank.infrastructure.web.security.Utils.JWTTokenUtils;
import io.jsonwebtoken.ExpiredJwtException;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter 
{
    private final String CLASS_NAME;
    private static Logger logger = LoggerFactory.getLogger(JWTAuthorizationFilter.class);
    private ApplicationContext appContext;

    public JWTAuthorizationFilter(AuthenticationManager authenticationManager, ApplicationContext appContext) 
    {
        super(authenticationManager);
        this.CLASS_NAME = this.getClass().getSimpleName();
        logger.debug(CLASS_NAME.concat("... OK!"));
        this.appContext = appContext;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        String token = request.getHeader(JWTConstantsUtils.AUTH_HEADER);

        if(token != null && token.startsWith(JWTConstantsUtils.TOKEN_PREFIX))
        {
            try
            {
                if(JWTTokenUtils.isBlockedToken(token, appContext))
                {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    throw new BlockedTokenException();
                }

                UsernamePasswordAuthenticationToken authentication = getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            catch(ExpiredJwtException | BlockedTokenException ex)
            {
                request.setAttribute("exception", ex);
                logger.debug(CLASS_NAME.concat("... FAILED!"));
            }
        }

        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(String token)
    {
        String username = JWTTokenUtils.getUsernameFromToken(token);
        Boolean isValid = JWTTokenUtils.isValidToken(token);

        return isValid ? new UsernamePasswordAuthenticationToken(username, null, AuthorityUtils.NO_AUTHORITIES) : null;
    }
}