package br.com.bluebank.application.service.exception;

import java.util.Map;

@SuppressWarnings("serial")
public class WithdrawException extends BlueBankException 
{
    public WithdrawException(String message) 
    {
        super(message);
    }

    public WithdrawException(Map<String, String> errors, String traceMessage) 
    {
        super(errors, traceMessage);
    }
}
