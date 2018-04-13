const path = require('path');
const fs = require('fs');

const ENV = process.env.NODE_ENV;

function getPath(folder) {
  const DEVMODE = process.env.DEV_MODE;
  let configFolderPath = folder;
  let projectPath = __dirname.split('/node_modules')[0];
  if (DEVMODE === 'development') {
    projectPath = path.dirname(__dirname);
    configFolderPath = `example/${folder}`;
  }
  return path.join(projectPath, configFolderPath);
}

function generateConfig() {
  const DEVMODE = process.env.DEV_MODE;
  let configFolderPath = 'config';
  let projectPath = __dirname.split('/node_modules')[0];
  if (DEVMODE === 'development') {
    projectPath = path.dirname(__dirname);
    configFolderPath = 'example/config';
  }
  const defaultFilePath = path.join(projectPath, configFolderPath, 'config.default.js');
  const filePath = path.join(projectPath, configFolderPath, `config.${ENV}.js`);
  try {
    const defaultConfig = require(defaultFilePath);
    const fileConfig = require(filePath);
    return Object.assign({}, defaultConfig, fileConfig);
  } catch (err) {
    console.warn(err);
  }
}

function generateMiddleware(config, router) {
  if (!config) {
    return [router.dispatch];
  }
  const DEVMODE = process.env.DEV_MODE;
  let middlewareFolderPath = 'middleware';
  let projectPath = __dirname.split('/node_modules')[0];
  if (DEVMODE === 'development') {
    projectPath = path.dirname(__dirname);
    middlewareFolderPath = 'example/middleware';
  }
  let middlewareConfig = [];
  if (config.middleware && Array.isArray(config.middleware) && config.middleware.length > 0) {
    middlewareConfig = config.middleware.map(middleware => {
      const filePath = path.join(projectPath, middlewareFolderPath, `${middleware}.js`);
      const middlewareFunction = require(filePath);
      return middlewareFunction;
    });
  }
  return [].concat(middlewareConfig, router.dispatch);
}

function generatePlugin(plugin) {
  const folderPath = getPath('plugin');
  try {
    const pluginArr = [];
    const plugins = fs.readdirSync(folderPath);
    for (let i = 0; i < plugins.length; i += 1) {
      const pluginName = plugins[i].split('.')[0];
      const PluginClass = require(path.join(folderPath, `${pluginName}.js`));
      plugin[pluginName] = new PluginClass();
    }
    return pluginArr;
  } catch (err) {
    console.log('you are not use any plugins');
    return [];
  }
}

module.exports = {
  generateConfig,
  generateMiddleware,
  generatePlugin,
  getPath,
};
