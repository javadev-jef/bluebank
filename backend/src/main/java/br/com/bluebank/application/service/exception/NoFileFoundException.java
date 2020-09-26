package br.com.bluebank.application.service.exception;

@SuppressWarnings("serial")
public class NoFileFoundException extends BlueBankException
{
    public NoFileFoundException() 
    {
        super("Nenhum arquivo foi selecionado");
    }

    public NoFileFoundException(String message) 
    {
        super(message);
    }
}
