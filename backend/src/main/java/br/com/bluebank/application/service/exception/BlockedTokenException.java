package br.com.bluebank.application.service.exception;

@SuppressWarnings("serial")
public class BlockedTokenException extends BlueBankException
{
    public BlockedTokenException() {}

    public BlockedTokenException(String message) 
    {
        super(message);
    } 
}
