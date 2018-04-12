const path = require('path');
const nunjucks = require('nunjucks');
const { getPath } = require('./generateConfig');

class Render {
  render(template, data = {}, toString = false) {
    return new Promise((resolve, reject) => {
      const templatePath = path.join(getPath('view'), template);
      let renderPage = nunjucks.render;
      if (toString) {
        renderPage = nunjucks.renderToString;
      }
      renderPage(templatePath, data, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      });
    });
  }
}

module.exports = Render;
