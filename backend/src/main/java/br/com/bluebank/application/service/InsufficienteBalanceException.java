package br.com.bluebank.application.service;

@SuppressWarnings("serial")
public class InsufficienteBalanceException extends Exception
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
