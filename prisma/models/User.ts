import {Optional, Sequelize, ModelAttributes, Model, DataTypes} from 'sequelize';

export const UserFactory = (sequelize: Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    biography: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  }, {
    tableName: 'User',
    timestamps: true,
    updatedAt: false,
  });

  return User;
};
