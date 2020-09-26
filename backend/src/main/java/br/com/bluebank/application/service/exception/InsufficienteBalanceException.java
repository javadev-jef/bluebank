package br.com.bluebank.application.service.exception;

@SuppressWarnings("serial")
public class InsufficienteBalanceException extends BlueBankException
{

    public InsufficienteBalanceException() 
    {
        super("Saldo insuficiente para realizar a transação solicitada.");
    }

    public InsufficienteBalanceException(String message) 
    {
        super(message);
    }
    
}
