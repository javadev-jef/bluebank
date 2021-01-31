package br.com.bluebank.infrastructure.web;

import java.util.Map;

import lombok.Getter;

@Getter
public class RestResponseError
{
    private Map<String, String> errors;
    private String message;

    private RestResponseError(){}

    public static RestResponseError fromValidationError(Map<String, String> errors)
    {
        RestResponseError resp = new RestResponseError();
        resp.errors = errors;

        return resp;
    }

    public static RestResponseError fromValidationError(Map<String, String> errors, String message)
    {
        RestResponseError resp = new RestResponseError();
        resp.errors = errors;
        resp.message = message;

        return resp;
    }

    public static RestResponseError fromMessage(String message)
    {
        RestResponseError resp = new RestResponseError();
        resp.message = message;

        return resp;
    }
}
