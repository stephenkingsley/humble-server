async function home(context) {
  const ret = await context.render('home.html', { title: 'Humble-Server' });
  return ret;
}

module.exports = home;
