package br.com.bluebank.infrastructure.web.security.Utils;

public class JWTConstantsUtils 
{
    public static final String URI_SERVER = "http://localhost:8080";
    public static final String AUTH_HEADER = "Authorization";
    public static final long ONE_DAY_EXPIRATION = 86400000;
    public static final long ONE_HOUR_EXPIRATION = 3600000;
    public static final long ONE_MINUTE_EXPIRATION = 1000 * 60;
    public static final long FIFTEEN_MINUTES_EXPIRATION = 15000 * 60;
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String SECRET_KEY = "sHIeeNQTmR0mWquCzwHELUAO0ppOktYoIjGqjzHb2MMBBT2/r93OOL9kd2zRCht8+udPKNGqiaTbxziHT+T7og==";
}