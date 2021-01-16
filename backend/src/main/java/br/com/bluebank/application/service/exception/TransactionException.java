package br.com.bluebank.application.service.exception;

import java.util.Map;

@SuppressWarnings("serial")
public class TransactionException extends BlueBankException {

    public TransactionException(Map<String, String> errors, String traceMessage) 
    {
        super(errors, traceMessage);
    }

    public TransactionException() 
    {
    }

    public TransactionException(String message) 
    {
        super(message);
    }
    
}
