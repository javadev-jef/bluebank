package br.com.bluebank.application.service.exception;

import java.util.Map;

import lombok.Getter;

@SuppressWarnings("serial")
public abstract class BlueBankException extends Exception
{
    @Getter
    private Map<String, String> errors;

    public BlueBankException(){}

    public BlueBankException(Map<String, String> errors, String traceMessage)
    {
        super(traceMessage);
        this.errors = errors;
    }

    public BlueBankException(String message) 
    {
        super(message);
    }
}
