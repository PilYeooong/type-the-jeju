import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import passportConfig from './passport';
import { sequelize } from './models';
import apiRouter from './routes';

dotenv.config();

const app = express();
passportConfig();
sequelize.sync({ force: false})
  .then(() => {
    console.log('DB connected')
  })
  .catch(() => {
    console.error('DB Error');
  })

const prod = process.env.NODE_ENV === 'production';
if (prod) {
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(morgan('dev'));
}
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET!,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send('server error');
});

app.listen(4000, () => {
  console.log(`server is running on port 4000`);
})