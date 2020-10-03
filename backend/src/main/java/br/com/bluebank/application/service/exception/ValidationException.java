package br.com.bluebank.application.service.exception;

import java.util.Map;

@SuppressWarnings("serial")
public class ValidationException extends BlueBankException 
{
    public ValidationException(Map<String, String> errors)
    {
        super(errors, "Erro de validação!");
    }

    public ValidationException(Map<String, String> errors, String traceMessage) 
    {
        super(errors, traceMessage);
    }
}
