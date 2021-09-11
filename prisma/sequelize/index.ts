import { Sequelize } from 'sequelize';
import { tryLoadEnvs } from '@prisma/sdk';
import path from 'path';

import { findSync } from './utils';
import config from './config.json';

const dirname = findSync(process.cwd(), ['prisma/sequelize', 'sequelize'], ['d'], ['d'], 1)[0] || __dirname;

import * as models from './models';

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

  Object.keys(models).forEach((model) => {
    models[model].initialize?.(sequelize);
    models[model].associate?.(models);
    models[model].hooks?.(models);
  });

  await sequelize.authenticate();

  return {
    sequelize,
    models,
  };
};
