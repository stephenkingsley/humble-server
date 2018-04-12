# humble-server
nodejs framework that provide convenient, steady server.

## Example
 - [online](http://144.202.112.189:6969/home)
 - [project](https://github.com/stephenkingsley/humble-server-example)

## Installation
humble-server requires node v8 or higher and async function support.

    $ npm install humble-server --save

## Hello Humble
```js
const HumbleServer = require('humble-server');
const humbleServerApp = new HumbleServer({
  numCPUs: 1,
  port: 6969,
});

humbleServerApp.router.get('/hello', () => 'hello humble');

humbleServerApp.start();
```

## Controller
This is the core for a nodejs app. The developer can design your own logic in this http request.

The rule number one is the controller must be `async/await` function. The return value will send automatically.

```js
async function home(context) {
  const ret = await context.render('home.html', { title: 'Humble-Server' });
  return ret;
}

module.exports = home;
```

## Router
Now let look back on [Hello Humber](#hello-humber). Using `humbleServerApp.router` to register controller router.

Route paths will be translated to regular expressions using [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

### Base Apis

#### humbleServerApp.router[method](path, controller)
 - method: `get`, `post`, `put`, `delete`, `patch`. 
 - path: url path.
 - controller: [controller](#controller)

```js
const home = require('./controller/home');
humbleServerApp.router.get('/home', home);
```

#### humbleServerApp.router.dynamicRouter(method, path)
 - method: http method, such as `get`, `post`, `put`, `delete`, `patch`.
 - path: url path.

In this api, Humble will find the controller according to your path.

```js
humbleServerApp.router.dynamicRouter('get', '/v1/api/:path*');
```

when `http.req.url` is `/v1/api/user/getUserInfo` that is match `/v1/api/:path`. [path-to-regexp](https://github.com/pillarjs/path-to-regexp) will return `user/getUserInfo` that is the `/:path*` value. And then Humble will execute `${your project dir}/controller/user/getUserInfo.js`.

## Middleware
Humble is a middleware framework such as [Koa](https://github.com/koajs/koa) that use async function.

Here is an example of logger middleware

```js
async function log1(context, next) {
  const startTime = new Date().getTime();
  console.log(`--- start middleware log1 url: ${context.req.url} ---`);
  const res = await next();
  console.log(`--- end middleware log1 url: ${context.req.url} dur: ${new Date().getTime() - startTime} ---`);
  return res;
}

module.exports = log1;
```

### Next
In middleware, `next` function is important that can execute next middleware automatically. So you can design your own logic in middleware.

## Config
Config will according to your `NODE_ENV` to require. But your have to has `config.default.js` file, this is the default config. 

Config file name: `config.${NODE_ENV}.js`

    $ NODE_ENV=production node index.js

Humble will loading config/config.default.js and `config/config.production.js`

### Middleware Config
if you have some middleware to run with any http request, you should defined in config.

```js
module.exports = {
  middleware: [
    'middleware1',
    'middleware2',
  ],
};

```

## View
View use [nunjucks](https://mozilla.github.io/nunjucks/). There is a api that name `render` can using in controller.

```js
// /controller/home.js
async function home(context) {
  const ret = await context.render('home.html', { title: 'Hello Humble-Server' });
  return ret;
}
module.exports = home;
```

and html template such as

```html
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    <h1>hello Humble-Server</h1>
  </body>
</html>
```

### context.render(template, data);
 - template: the html file name, Humble will find this file in view folder.
 - data: the data will pass to html template

## Develop
This project provided an example, just run `npm run dev`!

