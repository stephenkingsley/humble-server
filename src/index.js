const cluster = require('cluster');
const http = require('http');
const { generateConfig, generateMiddleware } = require('./generateConfig');
const composeMiddleware = require('./composeMiddleware');
const Router = require('./router');
const Render = require('./render');

class HumbleServer {
  constructor(obj = {}) {
    const render = new Render();
    this.router = new Router();
    this.config = generateConfig();
    this.middleware = generateMiddleware(this.config, this.router);
    this.numCPUs = obj.numCPUs || 1;
    this.port = obj.port || 6969;
    this.render = render.render;
  }

  start() {
    if (cluster.isMaster) {
      this.startMaster(this.numCPUs, this.port);
    } else {
      http.createServer(async (req, res) => {
        this.req = req;
        this.res = res;
        const ret = await this.fn(this).catch(err => err);
        res.end(ret);
      }).listen(this.port, () => this.callback());
      console.log(`Worker ${process.pid} started and http started in port ${this.port}`);
    }
  }

  startMaster() {
    if (!Number(this.numCPUs) || !Number(this.port)) {
      throw new Error('numCPUs and port must be number');
    }

    for (let i = 0; i < this.numCPUs; i += 1) {
      cluster.fork();
    }

    cluster.on('exit', worker => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  }

  callback() {
    this.fn = composeMiddleware(this.middleware);
  }
}

module.exports = HumbleServer;
