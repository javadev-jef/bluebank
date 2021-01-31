package br.com.bluebank;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;

@SpringBootApplication
public class BackendApplication implements RepositoryRestConfigurer
{
    private static final Logger logger = LoggerFactory.getLogger(BackendApplication.class);
	public static void main(String[] args) 
	{
        SpringApplication.run(BackendApplication.class, args);
    }

	@Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) 
    {
        config.getCorsRegistry()
            .addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE");

        logger.debug("Repository CORS setup... Ok!");
	} 
}
