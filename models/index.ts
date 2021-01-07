export * from './sequelize';
import User, { associate as userAssociate } from './user';
import Place, { associate as placeAssociate } from './place';
import Category, { associate as cateogoryAssociate } from './category';
import Image, { associate as imageAssociate } from './image';
import Hashtag, { associate as hashtagAssociate } from './hashtag';

const db = {
  User,
  Place,
  Category,
  Image,
  Hashtag,
}

export type dbType = typeof db;

userAssociate(db);
placeAssociate(db);
cateogoryAssociate(db);
imageAssociate(db);
hashtagAssociate(db);