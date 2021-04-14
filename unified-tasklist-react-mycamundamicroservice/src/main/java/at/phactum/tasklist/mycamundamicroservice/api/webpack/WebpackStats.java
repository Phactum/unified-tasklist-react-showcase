package at.phactum.tasklist.mycamundamicroservice.api.webpack;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import at.phactum.tasklist.mycamundamicroservice.common.webpack.Stats;
import at.phactum.tasklist.mycamundamicroservice.common.webpack.WebpackStatsBase;
import at.phactum.tasklist.mycamundamicroservice.config.MyCamundaMicroserviceDeploymentBuilder;
import io.swagger.annotations.Api;

@Api(value = "webpack")
@Controller
@RequestMapping("${openapi.frontend.base-path:/frontend/"
        + MyCamundaMicroserviceDeploymentBuilder.TENANT + "/"
        + MyCamundaMicroserviceDeploymentBuilder.TENANT + "-api/}")
public class WebpackStats extends WebpackStatsBase {

    private static Map<String, Stats> STATS;

    static {
        STATS = WebpackStatsBase.loadStats(MyCamundaMicroserviceDeploymentBuilder.TENANT);
    }

    @Override
    protected String getTenant() {
        return MyCamundaMicroserviceDeploymentBuilder.TENANT;
    }

    @Override
    protected Map<String, Stats> getStats() {
        return STATS;
    }

}
