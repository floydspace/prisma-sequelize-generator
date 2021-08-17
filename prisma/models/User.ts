import {Optional, Sequelize, ModelAttributes, Model, DataTypes} from 'sequelize';

export const UserFactory = (sequelize: Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    email: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    is18: {
      type: DataTypes.BOOLEAN,
    },
    name: {
      type: DataTypes.STRING,
    },
    successorId: {
      type: DataTypes.INTEGER,
    },
    keywords: {
      type: DataTypes.STRING,
    },
    biography: {
      type: DataTypes.JSONB,
    },
  }, {
    tableName: 'User'
  });

  return User;
};
