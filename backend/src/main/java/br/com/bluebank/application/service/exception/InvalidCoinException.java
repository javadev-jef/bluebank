package br.com.bluebank.application.service.exception;

@SuppressWarnings("serial")
public class InvalidCoinException extends DepositException
{
    public InvalidCoinException()
    {
        super("A moeda anexada é inválida ou já foi utilizada");
    }

    public InvalidCoinException(String message) 
    {
        super(message);
    } 
}
