package br.com.bluebank.application.service;

@SuppressWarnings("serial")
public class MyselfTransferException extends Exception
{
    public MyselfTransferException() 
    {
        super("Não faz sentido realizar uma transferência para mesma conta.");
    }

    public MyselfTransferException(String message) 
    {
        super(message);
    }
}
