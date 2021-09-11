import { Options, Sequelize } from 'sequelize';
import { tryLoadEnvs } from '@prisma/sdk';
import { mergeDeepRight } from 'ramda';
import path from 'path';

import { findSync } from './utils';
import config from './config.json';
import * as models from './models';

const dirname = findSync(process.cwd(), ['prisma/sequelize', 'sequelize'], ['d'], ['d'], 1)[0] || __dirname;

const loadedEnv = tryLoadEnvs({
  rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(dirname, config.relativeEnvPaths.rootEnvPath),
  schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(dirname, config.relativeEnvPaths.schemaEnvPath),
});
const env = { ...(loadedEnv ? loadedEnv.parsed : {}), ...process.env };
const databaseUrl = config.datasource.url.fromEnvVar
  ? env[config.datasource.url.fromEnvVar]
  : config.datasource.url.value;

export const createSequelizeInstance = (options?: Options) => {
  const withDefaults = mergeDeepRight({
    define: {
      freezeTableName: true,
    },
  });

  const sequelize = new Sequelize(databaseUrl, withDefaults(options ?? {}));

  // First initialize all models
  Object.keys(models).forEach((model) => {
    models[model].initialize?.(sequelize);
  });

  // Then apply associations
  Object.keys(models).forEach((model) => {
    models[model].associate?.(models);
    models[model].hooks?.(models);
  });

  return {
    sequelize,
    models,
  };
};
