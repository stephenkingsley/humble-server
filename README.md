# humble-server
nodejs framework that provide convenient, steady server.

## Example
 - [online](http://144.202.112.189:6969/hello)
 - [project](https://github.com/stephenkingsley/humble-server-example)

## Installation
humble-server requires node v8 or height and async function support.

    $ npm install humble-server

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

## Controler


## Router



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

## Develop
This project provided an example, just run `npm run dev`!

