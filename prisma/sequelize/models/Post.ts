import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

export class Post extends Model {
  static initialize(sequelize: Sequelize) {
    this.init(
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
  }

  static associate(models: Record<string, ModelCtor<Model>>) {
    this.belongsTo(models.User, { as: 'user', targetKey: 'id', foreignKey: 'userId' });
  }
}
