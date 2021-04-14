package at.phactum.tasklist.mycamundamicroservice.config;

import org.camunda.bpm.engine.ProcessEngine;
import org.springframework.stereotype.Component;

import at.phactum.tasklist.mycamundamicroservice.common.camunda.DeploymentBuilder;

/**
 * Used for two reasons:
 * <ol>
 * <li>Deploy processes of a particular sub-directory for a particular tenant.
 * Hint: tenants are used by the unified tasklist to identify the usertask's
 * hosting microservice.</li>
 * <li>If you want to bundle distinct (e.g. smaller) business cases into one
 * Spring Boot based Camunda microservice then those implementations (and BPMNs)
 * can be moved into distinct Maven modules by using a separate
 * DeploymentBuilder (and tenant) for each case.</li>
 * </ol>
 */
@Component
public class MyCamundaMicroserviceDeploymentBuilder extends DeploymentBuilder {

    public static final String TENANT = "mycamundamicroservice";

    public MyCamundaMicroserviceDeploymentBuilder(final ProcessEngine processEngine) {
        super(processEngine, TENANT, TENANT + "-workflows");
    }

    @Override
    protected Class<?> getDeploymentBuilderClass() {
        return MyCamundaMicroserviceDeploymentBuilder.class;
    }

}
