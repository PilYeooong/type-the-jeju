import { DataTypes, Model } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Image extends Model {
  public readonly id!: number;
  public src!: string;
}

Image.init(
  {
    src: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    modelName: 'Image',
    tableName: 'Images',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
  }
);

export const associate = (db: dbType) => {
  db.Image.belongsTo(db.Place);
}

export default Image;