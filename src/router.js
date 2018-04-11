const path = require('path');
const pathToRegexp = require('path-to-regexp');
const { getPath } = require('./generateConfig');

const httpMethod = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'PATCH',
  'TRACE',
];

class Router {
  constructor() {
    const self = this;
    httpMethod.forEach(method => {
      self[method.toLocaleLowerCase()] =
        (path, controler) => self.initRoute(path, controler, method.toLocaleLowerCase());
    });
    this.router = [];
    this.dynamic = {
      state: false,
      router: [],
    };
  }

  initRoute(path, controler, method) {
    const re = pathToRegexp(path);
    this.router.push({
      re,
      path,
      controler,
      method: method.toUpperCase(),
    });
  }

  dynamicRouter(method, path) {
    const re = pathToRegexp(path);
    this.dynamic.state = true;
    this.dynamic.router.push({
      path,
      re,
      method: method.toUpperCase(),
    });
  }

  async dispatch(context) {
    context.res.writeHead(200);
    let ret;
    const isMatch = context.router.router.filter(route => {
      if (
        route.method === context.req.method &&
        route.re.exec(context.req.url)
      ) {
        return route;
      }
    });

    if (isMatch && isMatch.length > 0) {
      ret = await isMatch[0].controler(context);
    } else if (context.router.dynamic.state) {
      let keys = [];
      const isMatchDynamic = context.router.dynamic.router.filter(route => {
        const tmpKeys = route.re.exec(context.req.url);
        if (
          route.method === context.req.method &&
          tmpKeys
        ) {
          keys = tmpKeys;
          return route;
        }
      });
      if (isMatchDynamic && isMatchDynamic.length > 0) {
        const controlerPath = getPath('controler');
        const controler = require(path.join(controlerPath, `${keys[1]}.js`));
        ret = await controler(context);
      } else {
        ret = 'can not match any router';
      }
    } else {
      ret = 'can not match any router';
    }
    return ret;
  }
}

module.exports = Router;
