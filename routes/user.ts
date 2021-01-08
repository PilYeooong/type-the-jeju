import * as express from 'express';
import {
  checkJejuNative,
  getMe,
  login,
  logout,
  signUp,
} from '../controllers/user';
import { isLoggedIn, isNotLoggedIn } from './middlewares';

const router = express.Router();

router.get('/', getMe);

router.post('/login', isNotLoggedIn, login);

router.post('/logout', isLoggedIn, logout);

router.post('/', isNotLoggedIn, signUp);

router.post('/check/jejunative', isLoggedIn, checkJejuNative);

export default router;
