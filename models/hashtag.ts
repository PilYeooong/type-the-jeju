import { DataTypes, Model } from 'sequelize';
import { dbType } from './index';
import { sequelize } from './sequelize';

class Hashtag extends Model {
  public readonly id!: number;
  public name!: string;
}

Hashtag.init(
  {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    modelName: 'Hashtag',
    tableName: 'Hashtags',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
  }
);

export const associate = (db: dbType): void => {
  db.Hashtag.belongsToMany(db.Place, { through: 'PlaceHashtag' });
}

export default Hashtag;