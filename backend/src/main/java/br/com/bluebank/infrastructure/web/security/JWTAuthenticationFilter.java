package br.com.bluebank.infrastructure.web.security;

import java.io.IOException;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import br.com.bluebank.domain.User.UserLogon;
import br.com.bluebank.infrastructure.web.RestResponseError;
import br.com.bluebank.infrastructure.web.security.Utils.JWTConstantsUtils;
import br.com.bluebank.infrastructure.web.security.Utils.JWTTokenUtils;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter
{
    private final String CLASS_NAME;
    private AuthenticationManager authenticationManager;
    private static Logger logger = LoggerFactory.getLogger(JWTAuthenticationFilter.class);

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager) 
    {
        this.CLASS_NAME = this.getClass().getSimpleName();
        this.authenticationManager = authenticationManager;
        logger.debug(CLASS_NAME.concat("... OK!"));
	}

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException{
            
        logger.debug(CLASS_NAME.concat("... RUNNING!"));

        try
        {
            ObjectMapper mapper = new ObjectMapper();
            UserLogon userLogon = mapper.readValue(request.getInputStream(), UserLogon.class);
            String jsonStr = mapper.writeValueAsString(userLogon);

            UsernamePasswordAuthenticationToken upat = new UsernamePasswordAuthenticationToken(jsonStr, userLogon.getPassword());

            return authenticationManager.authenticate(upat);
        }
        catch(IOException e)
        {
            throw new RuntimeException(e);
        }
    } 

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authResult) throws IOException, ServletException {

        UserDetailsImpl userDetails = (UserDetailsImpl) authResult.getPrincipal();

        String token = JWTTokenUtils.generateToken(userDetails, true);

        response.addHeader(JWTConstantsUtils.AUTH_HEADER, token);
        logger.debug(CLASS_NAME.concat("... SUCCESSFULY COMPLETE!"));
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException failed) throws IOException, ServletException {
        
        ObjectMapper mapper = new ObjectMapper();
        String msg = "Os dados de acesso informados estão incorretos";
        Map<String, String> errors = Map.of("username", "", "password", "");
        String jsonMessage = mapper.writeValueAsString(RestResponseError.fromValidationError(errors, msg));

        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.getWriter().write(jsonMessage);
        logger.debug(CLASS_NAME.concat("... FAILED!"));
    }
}
