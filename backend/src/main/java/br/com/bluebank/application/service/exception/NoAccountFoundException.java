package br.com.bluebank.application.service.exception;

import java.util.NoSuchElementException;

@SuppressWarnings("serial")
public class NoAccountFoundException extends NoSuchElementException
{

    public NoAccountFoundException() 
    {
        super("Nenhuma conta foi encontrada.");
    }

    public NoAccountFoundException(String s) 
    {
        super(s);
    }
    
}
