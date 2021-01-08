import * as passport from 'passport';
import local from './local';
import kakao from './kakao';
import User from '../models/user';

type IUser = Partial<User>;

export default (): void => {
  passport.serializeUser((user: IUser, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findOne({
        where: { id },
      });
      if (user) {
        return done(null, user);
      }
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
  kakao();
};
