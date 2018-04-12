async function duration(context, next) {
  const startTime = new Date().getTime();
  console.log(`--- request ${context.req.url} start ---`);
  const res = await next();
  console.log(`--- request ${context.req.url} end --- duration: ${new Date().getTime() - startTime}ms`);
  return res;
}

module.exports = duration;
