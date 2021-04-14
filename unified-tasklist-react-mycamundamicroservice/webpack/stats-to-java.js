
module.exports = {
  transform
};

function entrypointToModules(entrypoint) {

	var result = new Array();
	entrypoint.assets.forEach((asset) => {
			result.push(`${asset}`);
		});
	return result;

}

function statsAsObject(stats, webpackStats, tenant) {

	Object.keys(stats.entrypoints).forEach((entrypoint) => {
			var item = {
				tenant: `${tenant}`,
				moduleName: `${entrypoint}`,
				modules: entrypointToModules(stats.entrypoints[entrypoint])
			};
			webpackStats.push(item);
		});

}

function transform(stats, tenant, _opts) {

	var result = {
		webpackStats: []
	};
	statsAsObject(stats, result.webpackStats, tenant);
	return JSON.stringify(result);

}