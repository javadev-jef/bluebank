package br.com.bluebank.utils;

import java.io.IOException;
import java.io.InputStream;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ObjectMapperUtils 
{
    public static <T> T jsonToObject(InputStream is, Class<T> myClass) throws IOException 
    {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(is, myClass);
    }

    public static String ObjectToJson(Object object) throws IOException
    {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(object);
    }
}
