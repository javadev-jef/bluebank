package br.com.bluebank.application.service.exception;

import java.util.Map;

@SuppressWarnings("serial")
public class TransferException extends BlueBankException
{
    public TransferException(String message) 
    {
        super(message);
    }

    public TransferException(Map<String, String> errors, String numAccount) 
    {
        super(errors, "Os dados para transferência não conferem com a conta "+numAccount);
    }
}
