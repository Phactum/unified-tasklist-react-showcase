const fs = require('fs');
const path = require('path');

module.exports = {
  parseVersion,
  root,
  isExternalLib,
  resolveTsconfigPathsToAlias
};

const parseString = require('xml2js').parseString;
// return the version number from `pom.xml` file
function parseVersion() {
  let version = null;
  const pomXml = fs.readFileSync('../pom.xml', 'utf8');
  parseString(pomXml, (err, result) => {
    if (result.project.version && result.project.version[0]) {
      version = result.project.version[0];
      
      if (version.startsWith("${")) {
        let properties = result.project.properties[0];
      
        if (properties) {
            version = properties.revision[0] + properties.sha1[0] + properties.changelist[0];
        }
        console.log(version);
      }
    }
  });

  if (version === null) {
    throw new Error('pom.xml is malformed. No version is defined');
  }
  return version;
}

const _root = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

function isExternalLib(module, check = /node_modules/) {
  const req = module.userRequest;
  if (typeof req !== 'string') {
    return false;
  }
  return req.search(check) >= 0;
}

/**
 * Resolve tsconfig.json paths to Webpack aliases
 * @param  {string} tsconfigPath           - Path to tsconfig
 * @param  {string} webpackConfigBasePath  - Path from tsconfig to Webpack config to create absolute aliases
 * @return {object}                        - Webpack alias config
 */
function resolveTsconfigPathsToAlias({
    tsconfigPath = './tsconfig.json',
    webpackConfigBasePath = __dirname,
} = {}) {
    const { paths } = require(tsconfigPath).compilerOptions;

    const aliases = {};

    Object.keys(paths).forEach((item) => {
        const key = item.replace('/*', '');
        const value = path.resolve(webpackConfigBasePath, paths[item][0].replace('/*', '').replace('*', ''));
        console.warn(key, value);
        aliases[key] = value;
    });

    return aliases;
}
