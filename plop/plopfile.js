const path = require('path');

module.exports = function (plop) {
  plop.setHelper('eq', (v1, v2) => v1 === v2);
  plop.setHelper('ne', (v1, v2) => v1 !== v2);
  plop.setHelper('lt', (v1, v2) => v1 < v2);
  plop.setHelper('gt', (v1, v2) => v1 > v2);
  plop.setHelper('lte', (v1, v2) => v1 <= v2);
  plop.setHelper('gte', (v1, v2) => v1 >= v2);
  plop.setHelper('and', function () {
    return Array.prototype.every.call(arguments, Boolean);
  });
  plop.setHelper('or', function () {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  });

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
        path: 'models/index.ts',
        templateFile: path.join(__dirname, './models/index.ts.hbs'),
      },
      {
        type: 'add',
        path: 'index.ts',
        templateFile: path.join(__dirname, './index.ts.hbs'),
      },
      {
        type: 'add',
        path: 'config.json',
        template: '{{{config}}}',
      },
    ],
  });

  plop.setGenerator('Model.ts', {
    actions: () => [
      {
        type: 'add',
        path: 'models/{{model.name}}.ts',
        templateFile: path.join(__dirname, './models/Model.ts.hbs'),
      },
    ],
  });
};
