import { BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, Model } from 'sequelize';
import Hashtag from './hashtag';
import Image from './image';
import { dbType } from './index';
import { sequelize } from './sequelize';
import User from './user';

class Place extends Model {
  public readonly id!: number;
  public name!: string;
  public description!: string;
  public address!: string;
  public fee!: number;
  public lat?: number;
  public lng?: number;

  public UserId!: number;

  public addHashtags!: BelongsToManyAddAssociationsMixin<Hashtag, number>;
  public addImages!: HasManyAddAssociationsMixin<Image, number>;
  public addImage!: HasManyAddAssociationMixin<Image, number>;
  public addLiker!: BelongsToManyAddAssociationMixin<User, number>;
  public addLikers!: BelongsToManyAddAssociationsMixin<User, number>;
  public removeLiker!: BelongsToManyAddAssociationMixin<User, number>;
  public addWisher!: BelongsToManyAddAssociationMixin<User, number>;
  public removeWisher!: BelongsToManyAddAssociationMixin<User, number>;
}

Place.init(
  {
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lat: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    lng: {
      type: DataTypes.STRING(30),
      allowNull: true,
    }
  },
  {
    modelName: 'Place',
    tableName: 'Places',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    sequelize,
  }
);

export const associate = (db: dbType): void => {
  db.Place.belongsTo(db.User);
  db.Place.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
  db.Place.belongsToMany(db.User, { through: 'WishList', as: 'Wishers' });
  db.Place.belongsToMany(db.Hashtag, { through: 'PlaceHashtag' });
  db.Place.belongsTo(db.Category);
  db.Place.hasMany(db.Image);
}

export default Place;