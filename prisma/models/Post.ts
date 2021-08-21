import {Optional, Sequelize, ModelAttributes, Model, DataTypes} from 'sequelize';

export const PostFactory = (sequelize: Sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'Posts',
    timestamps: false,
  });

  return Post;
};
