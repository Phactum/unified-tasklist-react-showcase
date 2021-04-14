package at.phactum.tasklist.mycamundamicroservice.common.webpack;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

public abstract class WebpackStatsBase {
	
	private static Logger logger = LoggerFactory.getLogger(WebpackStatsBase.class);
	
	public static String getDevFile(final String tenant) {

		return System.getProperty(tenant + ".webpack");
		
	}
	
	public static Map<String, Stats> loadStats(final String tenant) {

		String webpackStatsFile = null;
		InputStream in = null;
		try {

			final var devFile = getDevFile(tenant);
			// for development
			if (devFile != null) {
				webpackStatsFile = devFile;
				in = new FileInputStream(devFile + "/webpack.json");
			}
			// for production
			else {
                webpackStatsFile = "static/frontend/" + tenant + "/webpack.json";
				in = new ClassPathResource(webpackStatsFile).getInputStream();
			}
			
			final var objectMapper = new ObjectMapper();
			final var stats = objectMapper.readValue(in, StatsWrapper.class);
			
			final var result = new HashMap<String, Stats>();
			Arrays.stream(stats.getWebpackStats())
					.forEach((s) -> {
						final var moduleUrls = s.getModules()
								.stream()
								.filter(Predicate.not(module -> module.endsWith(".map")))
								.map(module -> "/" + tenant + "/" + module)
								.collect(Collectors.toList());
						s.setModules(moduleUrls);
						result.put(s.getModuleName(), s);
					});
			return result;
			
		} catch (Exception e) {
			logger.error("Could not read file '" + webpackStatsFile + "' in classpath", e);
			return new HashMap<>();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {
					logger.warn(
							"Could not close input stream", e);
				}
			}
		}
		
	}

	protected abstract String getTenant();
	
	protected abstract Map<String, Stats> getStats();

	protected Map<String, Stats> getStatsForDevelopmentOrProduction() {
		
		if (getDevFile(getTenant()) != null) {
			return loadStats(getTenant());
		} else {
			return getStats();
		}
		
	}
	
	@ApiOperation(value = "Get the Webpack assets structure", nickname = "webpackStructure", notes = "The Webpack structure", response = Stats.class, tags={ "webpack", })
    @ApiResponses(value = { 
		@ApiResponse(code = 200, message = "The Webpack structure", response = Stats.class) })
	@RequestMapping(value = "webpack/{formKey}",
        produces = { "application/json" },
		method = RequestMethod.GET)
	public ResponseEntity<Stats> webpackStructure(
            @ApiParam(value = "The process' key", required = true) @PathVariable("formKey") String formKey
	) {

		final var stats = getStatsForDevelopmentOrProduction();
		final var currentStats = stats.get(formKey);
		if (currentStats == null) {
			return ResponseEntity.notFound()
					.cacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS))
					.build();
		} else {
			return ResponseEntity.ok()
					.cacheControl(CacheControl.maxAge(0, TimeUnit.SECONDS))
					.body(stats.get(formKey));
		}

	}

}
