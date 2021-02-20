package br.com.bluebank.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

public class ObjectMapperUtils 
{
    private static ObjectMapper getMapper()
    {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return mapper;
    }

    public static <T> T jsonToObject(InputStream is, Class<T> myClass) throws IOException 
    {
        return getMapper().readValue(is, myClass);
    }

    public static <T> T jsonToObject(String content, Class<T> myClass) throws IOException 
    {
        return getMapper().readValue(content, myClass);
    }

    public static String ObjectToJson(Object object) throws IOException
    {
        return getMapper().writeValueAsString(object);
    }

    public static MultiValueMap<String, String> objectToMultiValueMap(Object object)
    {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        Map<String, String> map = getMapper().convertValue(object, new TypeReference<Map<String, String>>(){});
        params.setAll(map);

        return params;
    }
}