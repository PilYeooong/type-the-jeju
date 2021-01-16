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
import { isLoggedIn, upload } from './middlewares';
import * as fs from 'fs';

try {
  fs.accessSync('uploads');
} catch (err) {
  console.log('uploads folder not exist, Creating');
  fs.mkdirSync('uploads');
}

const router = express.Router();

router.post('/images', upload.array('image'), addImages);

router.get('/search/address/:placeAddress', searchPlaceWithAddress);

router.get('/search/keyword/:placeName', searchPlaceWithKeyWord);

router.post('/', upload.none(), addPlace);

router.get('/:id', placeDetail);

router.patch('/:placeId/like', isLoggedIn, likePlace);

router.patch('/:placeId/unlike', isLoggedIn, unLikePlace);

router.patch('/:placeId/wish', isLoggedIn, wishPlace);

router.patch('/:placeId/unwish', isLoggedIn, unWishPlace);

router.post('/directions', searchDirections);

export default router;
