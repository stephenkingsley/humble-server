async function log1(context, next) {
  console.log(`--- start middleware log1 url: ${context.req.url} ---`);
  const res = await next();
  console.log(`--- end middleware log1 url: ${context.req.url} ---`);
  return res;
}

module.exports = log1;
