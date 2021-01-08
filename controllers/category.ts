import Category from '../models/category';
import Place from '../models/place';
import Image from '../models/image';
import Hashtag from '../models/hashtag';
import { NextFunction, Request, Response } from 'express';

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Category> | undefined> => {
  try {
    const category = await Category.create({
      name: req.body.name,
    });
    return res.status(201).send(category);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getCategorizedPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Place[]> | undefined> => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Place,
          include: [
            {
              model: Image,
            },
            {
              model: Hashtag,
              attributes: ['name'],
            },
            {
              model: Category,
              attributes: ['name'],
            },
          ],
        },
      ],
    });
    if (category) {
      return res.status(200).send(category.Places);
    }
    return res.status(404).send('존재하지 않는 카테고리 입니다.');
  } catch (err) {
    console.error(err);
    next(err);
  }
};
