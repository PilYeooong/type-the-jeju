import { DataTypes, Model } from 'sequelize';
import { dbType } from './index';
import Place from './place';
import { sequelize } from './sequelize';

class Category extends Model {
  public readonly id!: number;
  public name!: string;

  public Places?: Place[];
}

Category.init(
  {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
  }
);

export const associate = (db: dbType): void => {
  db.Category.hasMany(db.Place);
}

export default Category;