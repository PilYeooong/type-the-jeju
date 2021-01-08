import Place from '../models/place';
import Image from '../models/image';
import Hashtag from '../models/hashtag';
import Category from '../models/category';
import { NextFunction, Request, Response } from 'express';

export const getAllPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Place[]> | undefined> => {
  try {
    const places = await Place.findAll({
      include: [
        {
          model: Image,
          attributes: ['src'],
        },
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Hashtag,
          attributes: ['name'],
        },
      ],
      attributes: ['id', 'name', 'description', 'address', 'fee'],
    });
    return res.status(200).send(places);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
