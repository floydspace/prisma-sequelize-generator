import {Optional, Sequelize, ModelAttributes, Model, DataTypes} from 'sequelize';

export const PostFactory = (sequelize: Sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'Posts'
  });

  return Post;
};
