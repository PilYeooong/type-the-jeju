import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import Place from '../models/place';
import Image from '../models/image';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import { naverConfig } from '../utils/apiHeaders';

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<User> | undefined> => {
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Place,
            as: 'Wished',
            attributes: ['id', 'name', 'lat', 'lng'],
            include: [
              {
                model: Image,
                attributes: ['id', 'src'],
              },
            ],
          },
          {
            model: Place,
            as: 'Liked',
            attributes: ['id'],
          },
        ],
      });
      return res.status(200).send(user);
    }
    return res.status(200).send(null);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate('local', (err: Error, user: User, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res
        .status(401)
        .send(
          '해당 이메일로 가입 된 계정이 없거나 비밀번호가 일치하지 않습니다.'
        );
    }
    return req.login(user, async (loginErr: Error) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const loginUser = await User.findOne({
          where: { id: user.id },
          attributes: {
            exclude: ['password'],
          },
        });
        return res.status(200).send(loginUser);
      } catch (err) {
        console.error(err);
        return next(err);
      }
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response): void => {
  req.logout();
  req.session.destroy(() => {
    res.status(200).send('로그아웃 하였습니다.');
  });
};

export const signUp = async (
  req: Request<unknown, unknown, { email: string; password: string; nickname: string }>,
  res: Response,
  next: NextFunction
): Promise<Response<User> | undefined> => {
  try {
    const exUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (exUser) {
      return res.status(409).send('이미 사용중인 이메일입니다.');
    }
    const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    return res.status(201).send(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const checkJejuNative = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<boolean> | undefined> => {
  if (!req.user) {
    return res.status(401).send('로그인이 필요합니다.');
  }

  const { lat, lng } = req.body;

  try {
    const result = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${lng},${lat}&sourcecrs=epsg:4326&output=json&orders=legalcode`,
      naverConfig
    );
    if (result.data.results[0].region.area1.name === '제주특별자치도') {
      await User.update({ jejuNative: 1 }, { where: { id: req.user.id } });
      return res.status(200).send(true);
    }
    return res.status(200).send(false);
  } catch (err) {
    // console.error(err);
    next(err);
  }
};
