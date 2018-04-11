async function log2(context, next) {
  console.log(`--- start middleware log2 url: ${context.req.url} ---`);
  const res = await next();
  console.log(`--- end middleware log2 url: ${context.req.url} ---`);
  return res;
}

module.exports = log2;
