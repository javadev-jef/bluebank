package br.com.bluebank.infrastructure.web.security.Utils;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import br.com.bluebank.domain.Blacklist.BlacklistRepository;
import br.com.bluebank.infrastructure.web.security.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JWTTokenUtils
{
    private static final Key key = Keys.hmacShaKeyFor(JWTConstantsUtils.SECRET_KEY.getBytes());

    public static String loggedUsername()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication instanceof AnonymousAuthenticationToken)
        {
            return null;
        }

        return (String) authentication.getPrincipal();
    }

    public static String generateToken(UserDetailsImpl userDetails, Boolean withPrefix)
    {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", userDetails.getName());

        String token = doGenerateToken(claims, userDetails.getUsername());

        return withPrefix ? (JWTConstantsUtils.TOKEN_PREFIX + token) : token;
    }

    private static String doGenerateToken(Map<String, Object> claims, String subject)
    {
        // Retorna a hora atual em milissegundos
        final Long timeNow = System.currentTimeMillis();

        String uuid = UUID.randomUUID().toString();
        return Jwts.builder()
            .setId(uuid)
            .setSubject(subject)
            .setIssuer(JWTConstantsUtils.URI_SERVER).setIssuedAt(new Date(timeNow))
            .setExpiration(new Date(timeNow + JWTConstantsUtils.FIFTEEN_MINUTES_EXPIRATION)).addClaims(claims)
            .addClaims(claims)
            .signWith(key, SignatureAlgorithm.HS512).compact();
    }

    public static String getUsernameFromToken(String token)
    {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public static <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver)
    {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    public static Claims getAllClaimsFromToken(String token)
    {
        return Jwts.parserBuilder()
            .setSigningKey(key).build()
            .parseClaimsJws(token.replace(JWTConstantsUtils.TOKEN_PREFIX, "")).getBody();
    }

    private static Boolean isTokenExpired(String token)
    {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public static Date getExpirationDateFromToken(String token)
    {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public static Boolean isValidToken(String token)
    {
        final String username = getUsernameFromToken(token);
        return (username != null && !isTokenExpired(token));
    }

    public static Boolean isBlockedToken(String token, ApplicationContext appContext)
    {
        BlacklistRepository blacklistRepository = appContext.getBean(BlacklistRepository.class);
        String tokenId = getClaimFromToken(token, Claims::getId);

        return blacklistRepository.findById(tokenId).isPresent();
    }
}
