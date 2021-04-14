package at.phactum.tasklist.mycamundamicroservice.common.webpack;

import java.util.List;

public class Stats {

	private String tenant;
	
	private String moduleName;
	
	private List<String> modules;

	public String getTenant() {
		return tenant;
	}

	public void setTenant(String tenant) {
		this.tenant = tenant;
	}

	public List<String> getModules() {
		return modules;
	}

	public void setModules(List<String> modules) {
		this.modules = modules;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}
	
}
