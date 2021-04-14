package at.phactum.tasklist.mycamundamicroservice.common.camunda;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.repository.DeploymentWithDefinitions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

/**
 * @see https://forum.camunda.org/t/scanning-bpmn-files-in-submodules-of-a-spring-boot-2-application/9423/5
 */
public abstract class DeploymentBuilder {

	private Logger logger;
	
	private final String resourcesRootPath;
	
	private final String tenant;
	
	private final ProcessEngine processEngine;
	
	private DeploymentWithDefinitions deployment;
	
	public DeploymentBuilder(
			final ProcessEngine processEngine, final String tenant, final String resourcesRootPath) {
		
        this.logger = LoggerFactory.getLogger(getDeploymentBuilderClass());
		this.processEngine = processEngine;
		this.tenant = tenant;
		this.resourcesRootPath = resourcesRootPath;
		
	}

	@PostConstruct
	public void deployCamundaResources() {

		try {

	        Resource[] bpmnResources = findResources("*.bpmn");
	        Resource[] cmmnResources = findResources("*.cmmn");
	        Resource[] dmnResources = findResources("*.dmn");
	        if ((bpmnResources.length == 0)
	        		&& (cmmnResources.length == 0)
	        		&& (dmnResources.length == 0)) {
				logger.info("No resources for Camunda deployment found!");
				return;
	        }

			final var deploymentBuilder = processEngine
					.getRepositoryService()
					.createDeployment()
					.enableDuplicateFiltering(true)
					.tenantId(tenant)
					.name(tenant);

			for (Resource resource : bpmnResources) {
				deploymentBuilder.addInputStream(resource.getFilename(), resource.getInputStream());
			}

			for (Resource resource : cmmnResources) {
				deploymentBuilder.addInputStream(resource.getFilename(), resource.getInputStream());
			}

			for (Resource resource : dmnResources) {
				deploymentBuilder.addInputStream(resource.getFilename(), resource.getInputStream());
			}

			deployment = deploymentBuilder.deployWithResult();
			logger.info("Deployed Camunda resources: {}", deployment);

		} catch (Exception e) {

			logger.error("Could not build Camunda deployment!", e);

		}

	}
	
	public DeploymentWithDefinitions getDeployment() {
		return deployment;
	}
	
	public String getTenant() {
		return tenant;
	}

	private Resource[] findResources(final String pattern) throws IOException {
		
		ResourcePatternResolver resourcePatternResolver = new PathMatchingResourcePatternResolver();
		String path = "classpath*:"
				+ resourcesRootPath
				+ "/**/"
				+ pattern;
		return resourcePatternResolver.getResources(path);
		
	}

    protected abstract Class<?> getDeploymentBuilderClass();

}