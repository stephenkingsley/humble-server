async function home(context) {
  context.plugin.log.info('--- hello ---');
  const ret = await context.render('home.html', { title: 'Humble-Server' });
  return ret;
}

module.exports = home;
