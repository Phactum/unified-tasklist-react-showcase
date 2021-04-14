package at.phactum.tasklist.config;

import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.EncodedResourceResolver;

/**
 * Configure web component behavior.
 */
@Configuration
public class WebConfiguration implements WebMvcConfigurer {

	/**
     * Defines how to serve static resources.
     * 
     * @see at.phactum.tasklist.tools.common.web.SpaNoHandlerFoundExceptionHandler
     */
	@Override
	public void addResourceHandlers(final ResourceHandlerRegistry registry) {

		registry.addResourceHandler("/robots.txt")
				.setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
				.addResourceLocations("classpath:/static/robots.txt");
		registry.addResourceHandler("/favicon.ico")
				.setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
				.addResourceLocations("classpath:/static/frontend/favicon.ico");
		registry.addResourceHandler("/error-forbidden.html")
				.setCacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS).cachePublic())
				.addResourceLocations("classpath:/static/error-forbidden.html");
		registry.addResourceHandler("/error-unauthorized.html")
				.setCacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS).cachePublic())
				.addResourceLocations("classpath:/static/error-unauthorized.html");
		registry.addResourceHandler("/frontend/**")
				.setCacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS).cachePublic())
				.addResourceLocations("classpath:/static/frontend/")
				.resourceChain(true)
				.addResolver(new EncodedResourceResolver());
		// all other URLs are mapped to index.html. see SpaNoHandlerFoundExceptionHandler
		
	}
	
}
