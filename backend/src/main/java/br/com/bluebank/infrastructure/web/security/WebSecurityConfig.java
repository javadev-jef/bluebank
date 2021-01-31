package br.com.bluebank.infrastructure.web.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import br.com.bluebank.infrastructure.web.security.Utils.JWTConstantsUtils;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter implements WebMvcConfigurer
{
    private static Logger logger = LoggerFactory.getLogger(WebSecurityConfig.class);

    @Autowired
    private JWTAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Override
    protected void configure(HttpSecurity http) throws Exception 
    {
        http.csrf().disable().cors()
        .and()
            .headers().frameOptions().disable()
        .and()
            .httpBasic()
        .and()
            .authorizeRequests()
                .antMatchers("/api/user/register").permitAll()
                .anyRequest().authenticated()
        .and()
            .addFilterBefore(new EntryAuthenticationFilter(), JWTAuthenticationFilter.class)
            .addFilter(new JWTAuthenticationFilter(authenticationManager()))
            .addFilter(new JWTAuthorizationFilter(authenticationManager(), getApplicationContext()))
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .and()
        .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        logger.debug("Security setup... OK!");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) 
    {
        registry.addMapping("/login")
            .allowedOrigins("*")
            .allowedMethods("POST")
            .exposedHeaders(JWTConstantsUtils.AUTH_HEADER);

            logger.debug("CORS setup... OK!");
    }
}