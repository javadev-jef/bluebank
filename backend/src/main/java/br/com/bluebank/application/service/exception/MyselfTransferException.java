package br.com.bluebank.application.service.exception;

@SuppressWarnings("serial")
public class MyselfTransferException extends BlueBankException
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
