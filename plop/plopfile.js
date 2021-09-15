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
        path: 'utils/find.{{outputFormat}}',
        templateFile: path.join(__dirname, './{{outputFormat}}/utils/find.hbs'),
      },
      {
        type: 'add',
        path: 'utils/index.{{outputFormat}}',
        templateFile: path.join(__dirname, './{{outputFormat}}/utils/index.hbs'),
      },
    ],
  });

  plop.setGenerator('index', {
    actions: () => [
      {
        type: 'add',
        path: 'models/index.{{outputFormat}}',
        templateFile: path.join(__dirname, './{{outputFormat}}/models/index.hbs'),
      },
      {
        type: 'add',
        path: 'index.{{outputFormat}}',
        templateFile: path.join(__dirname, './{{outputFormat}}/index.hbs'),
      },
      {
        type: 'add',
        path: 'config.json',
        template: '{{{config}}}',
      },
    ],
  });

  plop.setGenerator('Model', {
    actions: () => [
      {
        type: 'add',
        path: 'models/{{modelName}}.{{outputFormat}}',
        templateFile: path.join(__dirname, './{{outputFormat}}/models/Model.hbs'),
      },
    ],
  });
};
