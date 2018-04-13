const HumbleServer = require('../src');
const home = require('./controller/home');

const humbleServerApp = new HumbleServer({
  numCPUs: 1,
  port: 6969,
});

humbleServerApp.router.get('/home', home);
humbleServerApp.router.dynamicRouter('get', '/v2/api/:path*');

humbleServerApp.start();
