package br.com.bluebank.application.service.exception;

import java.util.Map;

@SuppressWarnings("serial")
public class DepositException extends BlueBankException
{
    public DepositException(Map<String, String> errors, String traceMessage)
    {
        super(errors, traceMessage);
    }

    public DepositException(String message) 
    {
        super(message);
    }  
}
