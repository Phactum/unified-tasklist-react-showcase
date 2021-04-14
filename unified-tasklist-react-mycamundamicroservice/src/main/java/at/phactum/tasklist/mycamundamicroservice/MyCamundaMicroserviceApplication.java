package at.phactum.tasklist.mycamundamicroservice;

import java.util.Arrays;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.Environment;

/**
 * Main class.
 */
@SpringBootApplication
@ComponentScan(basePackages = "at.phactum")
public class MyCamundaMicroserviceApplication {

	private static final Logger logger = LoggerFactory.getLogger(MyCamundaMicroserviceApplication.class);

	/**
	 * Bootstrap spring boot application.
	 */
	public static void main(String... args) {

		final var app = new SpringApplication(MyCamundaMicroserviceApplication.class);
		setDevelopmentProfileIfNoOthersGiven(app);
		final var context = app.run(args);
		logApplicationStartup(context.getEnvironment());

	}

	private static void logApplicationStartup(final Environment env) {

		logger.info("Booted successfully. Active profiles are {}", Arrays.toString(env.getActiveProfiles()));
		
	}

	private static void setDevelopmentProfileIfNoOthersGiven(final SpringApplication app) {

		final var properties = new HashMap<String, Object>();
		properties.put("spring.profiles.default", "dev");
		app.setDefaultProperties(properties);

	}

}
