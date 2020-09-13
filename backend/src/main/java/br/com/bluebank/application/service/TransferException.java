package br.com.bluebank.application.service;

import java.util.Map;

import lombok.Getter;

@SuppressWarnings("serial")
public class TransferException extends Exception
{
    @Getter
    private Map<String, String> errors;

    @Getter
    private String numAccount;

    public TransferException() {}

    public TransferException(Map<String, String> errors, String numAccount)
    {
        super("Os dados para transferência não conferem com a conta "+numAccount);
        this.errors = errors;
        this.numAccount = numAccount;
    }

    public TransferException(String message) 
    {
        super(message);
    }  
}
