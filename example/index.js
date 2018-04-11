const HumbleServer = require('../src');
const home = require('./controler/home');

const humbleServerApp = new HumbleServer({
  numCPUs: 1,
  port: 6969,
});

humbleServerApp.router.get('/v1/api/:path', home);
humbleServerApp.router.dynamicRouter('get', '/v2/api/:path*');

humbleServerApp.start();

