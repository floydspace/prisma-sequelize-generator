import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

export const UserFactory = (sequelize: Sequelize) => {
  class User extends Model {
    static associate(models: Record<string, ModelCtor<Model>>) {
      this.belongsTo(models.User, { as: 'successor', targetKey: 'id', foreignKey: 'successorId' });
      this.hasMany(models.Post, { as: 'posts' });
      this.hasOne(models.User, { as: 'predecessor' });
    }
  }

  User.init(
    {
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
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'User',
      timestamps: true,
      updatedAt: false,
    }
  );

  return User;
};
