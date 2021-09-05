import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

export const PostFactory = (sequelize: Sequelize) => {
  class Post extends Model {
    static associate(models: Record<string, ModelCtor<Model>>) {
      this.belongsTo(models.User, { targetKey: 'id', foreignKey: 'userId' });
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'Posts',
      timestamps: false,
    }
  );

  return Post;
};
