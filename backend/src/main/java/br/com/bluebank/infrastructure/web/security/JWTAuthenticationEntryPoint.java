package br.com.bluebank.infrastructure.web.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;

import br.com.bluebank.application.service.exception.BlockedTokenException;
import io.jsonwebtoken.ExpiredJwtException;

@Component
public class JWTAuthenticationEntryPoint implements AuthenticationEntryPoint 
{
    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        
        Object exception;
        if((exception = request.getAttribute("exception")) != null)
        {
            if(exception instanceof BlockedTokenException)
            {
                BlockedTokenException ex = (BlockedTokenException) exception;
                resolver.resolveException(request, response, null, ex);
            }
            else if(exception instanceof ExpiredJwtException)
            {
                ExpiredJwtException ex = (ExpiredJwtException) exception;
                resolver.resolveException(request, response, null, ex);
            }
        }
        else{
            throw authException;
        }
    }
}


