import * as express from 'express';
import {
  addImages,
  addPlace,
  likePlace,
  placeDetail,
  searchDirections,
  searchPlaceWithAddress,
  searchPlaceWithKeyWord,
  unLikePlace,
  unWishPlace,
  wishPlace,
} from '../controllers/place';
import { isLoggedIn, isNotLoggedIn, upload } from './middlewares';

const router = express.Router();

router.post('/images', upload.array('image'), addImages);

router.get('/search/address/:placeAddress', searchPlaceWithAddress);

router.get('/search/keyword/:placeName', searchPlaceWithKeyWord);

router.post('/', upload.none(), addPlace);

router.get('/:id', placeDetail);

router.patch('/:placeId/like', likePlace);

router.patch('/:placeId/unlike', unLikePlace);

router.patch('/:placeId/wish', wishPlace);

router.patch('/:placeId/unwish', unWishPlace);

router.post('/directions', searchDirections);

export default router;
