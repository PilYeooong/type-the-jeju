import * as express from 'express';
import userRouter from './user';
import authRouter from './auth';
import placeRouter from './place';
import placesRouter from './places';
import categoryRouter from './category';

const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/place', placeRouter);
router.use('/places', placesRouter);
router.use('/category', categoryRouter);

export default router;
