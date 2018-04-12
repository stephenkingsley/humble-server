async function home(context) {
  const ret = await context.render('home.html', {});
  return ret;
}

module.exports = home;
