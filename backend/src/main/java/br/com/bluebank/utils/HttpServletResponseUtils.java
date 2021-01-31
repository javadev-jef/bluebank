package br.com.bluebank.utils;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;

import br.com.bluebank.infrastructure.web.RestResponseError;

public class HttpServletResponseUtils 
{
    private static HttpServletResponse initialConfig(HttpServletResponse response, HttpStatus status)
    {
        response.setCharacterEncoding("UTF-8");
        response.setStatus(status.value());

        return response;
    }

    public static HttpServletResponse getFinalResponse(HttpServletResponse response, String msgError, HttpStatus status)
            throws IOException{
        
        response = initialConfig(response, status);
        response.getWriter().write(ObjectMapperUtils.ObjectToJson(RestResponseError.fromMessage(msgError)));

        return response;
    }

    public static HttpServletResponse getFinalResponse(HttpServletResponse response, Map<String, String> errors, HttpStatus status)
            throws IOException{
        
        response = initialConfig(response, status);
        response.getWriter().write(ObjectMapperUtils.ObjectToJson(RestResponseError.fromValidationError(errors)));

        return response;
    }
}
