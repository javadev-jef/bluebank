package br.com.bluebank.utils;

import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

public class StringUtils 
{
    public static boolean isEmpty(String value)
    {
        return value == null ? true : value.trim().length() == 0;
    } 

    public static String leftZeroes(int value, int finalSize)
    {
        return String.format("%0"+finalSize+"d", value);
    }

    public static String encrypt(String rawString)
    {
        if(isEmpty(rawString))
        {
            return null;
        }

        PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        return encoder.encode(rawString);
    }
}