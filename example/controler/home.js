async function home(context) {
  return `request: ${context.req.url} ---home`;
}

module.exports = home;
