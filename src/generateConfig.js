const path = require('path');

const ENV = process.env.NODE_ENV;

function getPath(folder) {
  const DEVMODE = process.env.DEV_MODE;
  let configFolderPath = folder;
  if (DEVMODE === 'development') {
    configFolderPath = `example/${folder}`;
  }
  return path.join(path.dirname(__dirname), configFolderPath);
}

function generateConfig() {
  const DEVMODE = process.env.DEV_MODE;
  let configFolderPath = 'config';
  if (DEVMODE === 'development') {
    configFolderPath = 'example/config';
  }
  const defaultFilePath = path.join(path.dirname(__dirname), configFolderPath, 'config.default.js');
  const filePath = path.join(path.dirname(__dirname), configFolderPath, `config.${ENV}.js`);
  try {
    // eslint-disable-line global-require
    const defaultConfig = require(defaultFilePath);
    const fileConfig = require(filePath);
    return Object.assign({}, defaultConfig, fileConfig);
  } catch (err) {
    throw err;
  }
}

function generateMiddleware(config, router) {
  const DEVMODE = process.env.DEV_MODE;
  let middlewareFolderPath = 'middleware';
  if (DEVMODE === 'development') {
    middlewareFolderPath = 'example/middleware';
  }
  let middlewareConfig;
  if (config.middleware && Array.isArray(config.middleware)) {
    middlewareConfig = config.middleware.map(middleware => {
      const filePath = path.join(path.dirname(__dirname), middlewareFolderPath, `${middleware}.js`);
      const middlewareFunction = require(filePath);
      return middlewareFunction;
    });
  }
  return [].concat(middlewareConfig, router.dispatch);
}

module.exports = {
  generateConfig,
  generateMiddleware,
  getPath,
};
