package at.phactum.tasklist.tools.common.web;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;


/**
 * @see https://medium.com/@kshep92/single-page-applications-with-spring-boot-b64d8d37015d
 */
@ConditionalOnProperty(prefix = "spring", name = "application.spa-default-file")
@ControllerAdvice
public class SpaNoHandlerFoundExceptionHandler {

	@Autowired
	private ResourceLoader resourceLoader;
	
	@Value("${spring.application.spa-default-file}")
	private String defaultFile;
	
	@ExceptionHandler
	public ResponseEntity<Resource> renderDefaultPage(final NoHandlerFoundException exception) {
		
		final var uri = "classpath:/static"
				+ exception.getRequestURL()
				+ (exception.getRequestURL().endsWith(".html") ? "" : ".html");
		var resource = resourceLoader.getResource(uri);
		if (!resource.exists()) {
			resource = resourceLoader.getResource(defaultFile);
		}
		return ResponseEntity
				.ok()
				.contentType(MediaType.TEXT_HTML)
				.cacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS))
				.body(resource);

	}
	
}
