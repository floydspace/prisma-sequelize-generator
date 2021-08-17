import { ModelCtor, Sequelize } from 'sequelize';

import config from '../config/config.json';
import { UserFactory } from './User';
import { PostFactory } from './Post';

const env = process.env.NODE_ENV != 'prd' ? 'development' : 'production';
const {username, password, database, host, port} = config[env];

export const createInstance = async () => {
  const sequelize = new Sequelize(
    database,
    username,
    password,
    {
      host,
      port,
      ssl: true,
      dialect: 'postgres',
      dialectModule: pg,
      pool: {},
      dialectOptions: {
        connectTimeout: process.env.CONNECTION_TIMEOUT
      },
      define: {
        freezeTableName: true,
        timestamps: true,
        paranoid: true
      }
    },
  );

  const models = {
    User: UserFactory(sequelize),
    Post: PostFactory(sequelize),
  };

  Object.keys(models).forEach(model => {
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
    models
  };
};
