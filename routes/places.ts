import * as express from 'express';
import { getAllPlaces } from '../controllers/places';

const router = express.Router();

router.get('/', getAllPlaces);

export default router;
