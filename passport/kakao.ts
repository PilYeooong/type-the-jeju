import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';

import User from '../models/user';

dotenv.config();

export default () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID!,
        callbackURL: '/api/auth/kakao/callback',
        clientSecret: '',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const hashedPassword = await bcrypt.hash(
              Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              10
            );
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account.email,
              password: hashedPassword,
              nickname: profile.displayName,
              snsId: profile.id,
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
