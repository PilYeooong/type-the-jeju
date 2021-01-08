import * as express from 'express';
import { createCategory, getCategorizedPlaces } from '../controllers/category';

const router = express.Router();

router.post('/', createCategory);

router.get('/:id', getCategorizedPlaces);

export default router;
