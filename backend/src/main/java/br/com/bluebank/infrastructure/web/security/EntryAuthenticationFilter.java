package br.com.bluebank.infrastructure.web.security;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.Path;
import javax.validation.Validation;
import javax.validation.Validator;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import br.com.bluebank.domain.User.UserLogon;
import br.com.bluebank.infrastructure.web.security.Utils.JWTConstantsUtils;
import br.com.bluebank.utils.HttpServletResponseUtils;
import br.com.bluebank.utils.ObjectMapperUtils;

public class EntryAuthenticationFilter extends OncePerRequestFilter 
{
    private final String CLASS_NAME;
    private static Logger logger = LoggerFactory.getLogger(EntryAuthenticationFilter.class);

    public EntryAuthenticationFilter() 
    {
        this.CLASS_NAME = this.getClass().getSimpleName();
        logger.debug(CLASS_NAME.concat("... OK!"));
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException 
    {
        String path = request.getServletPath();
        
        return path.equals("/api/user/register") 
            || path.equals("/api/server/default-response/public")
            || path.equals("/api/user/account/deposit")
            || path.startsWith("/api/account/fetchFavoredName/");
    }

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

        request = new RequestWrapper(request);
        String token = request.getHeader(JWTConstantsUtils.AUTH_HEADER);

        if(token == null)
        {
            logger.debug(CLASS_NAME.concat("... RUNNING!"));

            try
            {
                UserLogon userLogon = ObjectMapperUtils.jsonToObject(request.getInputStream(), UserLogon.class);
                Map<String, String> errors = userFilterValidation(userLogon);
    
                if (errors.size() != 0) 
                {
                    response = HttpServletResponseUtils.getFinalResponse(response, errors, HttpStatus.BAD_REQUEST);
                    logger.debug(CLASS_NAME.concat("... FAILED!"));

                    return;
                }
            }
            catch(InvalidFormatException ex)
            {
                response = HttpServletResponseUtils.getFinalResponse(response, ex.getOriginalMessage(), HttpStatus.UNAUTHORIZED);
                logger.debug(CLASS_NAME.concat("... FAILED!"));

                return;
            }
            catch(MismatchedInputException ex)
            {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                logger.debug(CLASS_NAME.concat("... JSON MAPPER ERROR - FAILED!"));

                return;
            }
            
            logger.debug(CLASS_NAME.concat("... SUCCESSFULY COMPLETE!"));
        }

        chain.doFilter(request, response);
    }
    
    private Map<String, String> userFilterValidation(UserLogon userLogon) 
    {
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        Set<ConstraintViolation<UserLogon>> violations = validator.validate(userLogon);

        Map<String, String> errors = new LinkedHashMap<>();
        for (ConstraintViolation<UserLogon> cv : violations) 
        {
            String attributeError = extractAttributeError(cv.getPropertyPath());
            errors.put(attributeError, cv.getMessage());
        }

        return errors;
    }

    private String extractAttributeError(Path path) 
    {
        String pathError = path.toString();
        String[] arrayStr = pathError.split("\\.");

        return arrayStr[arrayStr.length - 1];
    }
}
