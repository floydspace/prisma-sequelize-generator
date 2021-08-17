const path = require('path');

module.exports = function (plop) {
  plop.setGenerator('index.ts', {
    actions: () => [
      {
        type: 'add',
        path: 'index.ts',
        templateFile: path.join(__dirname, './index.ts.hbs'),
      },
    ],
  });

  plop.setGenerator('Model.ts', {
    actions: () => [
      {
        type: 'add',
        path: '{{model.name}}.ts',
        templateFile: path.join(__dirname, './Model.ts.hbs'),
      },
    ],
  });
};
