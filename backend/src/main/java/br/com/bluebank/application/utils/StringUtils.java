package br.com.bluebank.application.utils;

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
}