import { ModelCtor, Sequelize } from 'sequelize';
import { tryLoadEnvs } from '@prisma/sdk';
import path from 'path';
import { findSync } from './utils';

const dirname = findSync(process.cwd(), ['prisma/models', 'models'], ['d'], ['d'], 1)[0] || __dirname;

import { UserFactory } from './User';
import { PostFactory } from './Post';

const config = {
  "generator": {
    "name": "models",
    "provider": {
      "fromEnvVar": null,
      "value": "node ./dist/generator.js"
    },
    "output": {
      "value": "/Users/victor/Projects/_own/prisma-sequelize-generator/prisma/models",
      "fromEnvVar": "null"
    },
    "config": {},
    "binaryTargets": [],
    "previewFeatures": []
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../.env",
    "schemaEnvPath": "../../.env"
  },
  "datasource": {
    "name": "db",
    "provider": "postgresql",
    "activeProvider": "postgresql",
    "url": {
      "fromEnvVar": "DATABASE_URL",
      "value": null
    }
  }
};

const loadedEnv = tryLoadEnvs({
  rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(dirname, config.relativeEnvPaths.rootEnvPath),
  schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(dirname, config.relativeEnvPaths.schemaEnvPath),
});
const env = { ...(loadedEnv ? loadedEnv.parsed : {}), ...process.env };
const databaseUrl = config.datasource.url.fromEnvVar
  ? env[config.datasource.url.fromEnvVar]
  : config.datasource.url.value;

export const createInstance = async () => {
  const sequelize = new Sequelize(databaseUrl, {
    ssl: true,
    define: {
      freezeTableName: true,
    },
  });

  const models = {
    User: UserFactory(sequelize),
    Post: PostFactory(sequelize),
  };

  Object.keys(models).forEach((model) => {
    if (models[model].associate) {
      models[model].associate(models);
    }

    if (models[model].hooks) {
      models[model].hooks(models);
    }
  });

  await sequelize.authenticate();

  return {
    sequelize,
    models,
  };
};
