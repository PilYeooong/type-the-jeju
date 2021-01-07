const dotenv = require('dotenv');

dotenv.config();

type Config = {
  username: string,
  password: string,
  database: string,
  host: string,
  logging: boolean,
  [key: string]: string | boolean,
}

interface IConfig {
  development: Config;
  test: Config;
  production: Config;
}

const config: IConfig = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD!,
    "database": "ts-jeju",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": true
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD!,
    "database": "hotjeju_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false,
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD!,
    "database": "ts-jeju",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false,
  }
}

export default config;