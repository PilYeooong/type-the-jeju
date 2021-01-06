export * from './sequelize';
import User, { associate as userAssociate } from './user';

const db = {
  User
}

export type dbType = typeof db;

userAssociate(db);