package br.com.bluebank.application.service;

@SuppressWarnings("serial")
public class WithdrawException extends Exception
{

    public WithdrawException() {}

    public WithdrawException(String message) 
    {
        super(message);
    }
    
}
