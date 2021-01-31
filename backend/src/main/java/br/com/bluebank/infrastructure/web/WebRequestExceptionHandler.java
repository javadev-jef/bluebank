package br.com.bluebank.infrastructure.web;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import br.com.bluebank.application.service.exception.BlockedTokenException;
import br.com.bluebank.application.service.exception.BlueBankException;
import br.com.bluebank.application.service.exception.NoAccountFoundException;
import io.jsonwebtoken.ExpiredJwtException;

@RestControllerAdvice
public class WebRequestExceptionHandler extends ResponseEntityExceptionHandler 
{
    private final String CLASS_NAME;
    private static final Logger logger = LoggerFactory.getLogger(WebRequestExceptionHandler.class);

    public WebRequestExceptionHandler() 
    {
        this.CLASS_NAME = this.getClass().getSimpleName();
        logger.debug(CLASS_NAME.concat("... OK!"));
    }

    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public RestResponseError handleException(ExpiredJwtException e)
    {
        logger.debug(CLASS_NAME.concat("...... EXPIRED TOKEN!"));
        return RestResponseError.fromMessage("Sua sessão expirou, realize um novo login para continuar!");
    }
    
    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public RestResponseError handleException(BlueBankException ex) 
    {
        if (ex.getErrors() != null) 
        {
            return RestResponseError.fromValidationError(ex.getErrors());
        }

        return RestResponseError.fromMessage(ex.getMessage());
    }

    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.UNAUTHORIZED)
    public RestResponseError handleException(BlockedTokenException e)
    {
        logger.debug(CLASS_NAME.concat("...... BLOCKED TOKEN!"));
        return RestResponseError.fromMessage("Token autenticação inválido para conexão.");
    }

    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public RestResponseError handleException(NoAccountFoundException ex) 
    {
        Map<String, String> errors = new LinkedHashMap<>();
        errors.put("numAccount", "O número da conta informado não existe");

        return RestResponseError.fromValidationError(errors);
    }

    // ERROR HANDLE FOR @VALID
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatus status, WebRequest request) {

        return extractErrorsToResponse(ex.getBindingResult(), headers, status);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
            HttpHeaders headers, HttpStatus status, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", status.value());
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, headers, status);
    }

    // ERROR HANDLE FOR MULTI-PART-FILE AND OTHERS
    @Override
    protected ResponseEntity<Object> handleBindException(BindException ex, HttpHeaders headers, HttpStatus status,WebRequest request) 
    {
        return extractErrorsToResponse(ex.getBindingResult(), headers, status);
    }

    private ResponseEntity<Object> extractErrorsToResponse(BindingResult bindingResult, HttpHeaders headers, HttpStatus status)
    {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", status.value());

        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) 
        {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        body.put("errors", errors);

        return new ResponseEntity<>(body, headers, status);
    }
}