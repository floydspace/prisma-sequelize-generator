const path = require('path');

module.exports = function (plop) {
  plop.setGenerator('utils', {
    actions: () => [
      {
        type: 'add',
        path: 'utils/find.ts',
        templateFile: path.join(__dirname, './utils/find.ts.hbs'),
      },
      {
        type: 'add',
        path: 'utils/index.ts',
        templateFile: path.join(__dirname, './utils/index.ts.hbs'),
      },
    ],
  });

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
