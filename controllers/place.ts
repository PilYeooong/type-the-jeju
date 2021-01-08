import axios, { AxiosResponse } from 'axios';
import Place from '../models/place';
import Image from '../models/image';
import Hashtag from '../models/hashtag';
import Category from '../models/category';
import User from '../models/user';
import { naverConfig, kakaoConfig } from '../utils/apiHeaders';
import { NextFunction, Request, Response } from 'express';

export const addImages = async (
  req: Request,
  res: Response
): Promise<Response<string[]>> => {
  return res.send((req.files as Express.Multer.File[]).map((f) => f.filename));
};

export const addPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Place> | undefined> => {
  try {
    if (!req.user) {
      return res.status(401).send('로그인이 필요합니다.');
    }
    const category = await Category.findOne({
      where: { name: req.body.category },
    });
    if (!category) {
      return res.status(400).send('존재하지 않는 카테고리 입니다.');
    }
    const exPlace = await Place.findOne({ where: { name: req.body.name } });
    if (exPlace) {
      return res.status(409).send('같은 이름의 장소가 존재합니다.');
    }
    const hashtags: string[] = req.body.description.match(/#[^\s]+/g);
    const description: string = req.body.description
      .replace(/#[^\s]+/g, '')
      .trim();
    const place = await Place.create({
      CategoryId: category.id,
      name: req.body.name,
      description,
      address: req.body.address,
      UserId: req.user.id,
      lat: req.body.lat,
      lng: req.body.lng,
      fee: 0,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((v) =>
          Hashtag.findOrCreate({ where: { name: v.slice(1).toLowerCase() } })
        )
      );
      await place.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images: Image[] = await Promise.all(
          req.body.image.map((image: Image) => Image.create({ src: image }))
        );
        await place.addImages(images);
      } else {
        const image: Image = await Image.create({ src: req.body.image });
        await place.addImage(image);
      }
    }
    return res.status(201).send(place);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const placeDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Place> | undefined> => {
  try {
    const place = await Place.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Image,
        },
        {
          model: User,
          as: 'Wishers',
          attributes: ['id'],
        },
        {
          model: User,
          as: 'Likers',
          attributes: ['id'],
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
    });
    if (!place) {
      return res.status(404).send('존재하지 않는 장소입니다.');
    }
    return res.status(200).send(place);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const likePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Record<string, number>> | undefined> => {
  try {
    if (!req.user) {
      return res.status(401).send('로그인이 필요합니다.');
    }
    const place = await Place.findOne({
      where: { id: parseInt(req.params.placeId, 10) },
    });
    if (!place) {
      return res.status(404).send('존재하지 않는 장소입니다.');
    }
    await place.addLiker(req.user.id);
    return res.status(200).json({ placeId: place.id, userId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const unLikePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Record<string, number>> | undefined> => {
  try {
    const place = await Place.findOne({
      where: { id: parseInt(req.params.placeId, 10) },
    });
    if (!place) {
      return res.status(404).send('존재하지 않는 장소입니다.');
    }
    if (!req.user) {
      return res.status(401).send('로그인이 필요합니다.');
    }
    await place.removeLiker(req.user.id);
    return res.status(200).json({ placeId: place.id, userId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const wishPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Record<string, Place | number>> | undefined> => {
  try {
    const place = await Place.findOne({
      where: { id: parseInt(req.params.placeId, 10) },
      include: [{ model: Image }],
    });
    if (!place) {
      return res.status(404).send('존재하지 않는 장소입니다.');
    }
    if (!req.user) {
      return res.status(401).send('로그인이 필요합니다.');
    }
    await place.addWisher(req.user.id);
    return res.status(200).json({ place, userId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const unWishPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Record<string, Place | number>> | undefined> => {
  try {
    const place = await Place.findOne({
      where: { id: parseInt(req.params.placeId, 10) },
    });
    if (!place) {
      return res.status(404).send('존재하지 않는 장소입니다.');
    }
    if (!req.user) {
      return res.status(401).send('로그인이 필요합니다.');
    }
    // const isWished = place.Wishers.find((v) => v.id === req.user.id);
    // if (isWished) {
    await place.removeWisher(req.user.id);
    return res.status(200).json({ placeId: place.id, userId: req.user.id });
    // }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

interface IDirectionGuide {
  pointIndex: number;
  type: number;
  instructions: string;
  distance: number;
  duration: number;
}

interface IDirectionSection {
  pointIndex: number;
  pointCount: number;
  distance: number;
  name: string;
  congestion: number;
  speed: number;
}
interface IDirectionStartOrGoal {
  location: [number, number];
  dir?: number;
}

interface IDirectionSummary {
  start: IDirectionStartOrGoal;
  goal: IDirectionStartOrGoal;
  distance: number;
  duration: number;
  bbox: [number, number][];
  tollFare: number;
  taxiFare: number;
  fuelPrice: number;
}

interface IDirectionRoute {
  summary: IDirectionSummary[];
  path: [number, number][];
  section: IDirectionSection[];
  guide: IDirectionGuide[];
}

interface IDirectionResult {
  code: number;
  message: string;
  currentDateTime: string;
  route: IDirectionRoute;
}

export const searchDirections = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<IDirectionResult> | undefined> => {
  const { origin, destination, wayPoints } = req.body;
  let wayPointsParams = '';
  for (let i = 0; i < wayPoints.length; i++) {
    if (i === wayPoints.length - 1) {
      wayPointsParams += `${wayPoints[i].lng},${wayPoints[i].lat}`;
    } else {
      wayPointsParams += `${wayPoints[i].lng},${wayPoints[i].lat}|`;
    }
  }
  const startPoint = `${origin.lng},${origin.lat}`;
  const endPoint = `${destination.lng},${destination.lat}`;
  try {
    const result: AxiosResponse<IDirectionResult> = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${startPoint}&goal=${endPoint}&waypoints=${wayPointsParams}&option=traoptimal`,
      naverConfig
    );
    return res.status(200).send(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

interface IAddress {
  idx?: number;
  address_name?: string;
  place_name?: string;
  lng?: string;
  lat?: string;
}

interface IAddressMeta {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
}

interface IAddressDocuments {
  address_name: string;
  place_name: string;
  address_type: string;
  x: string;
  y: string;
  address: Record<string, string>;
  road_address: Record<string, string>;
}

interface IAddressSearchResult {
  meta: IAddressMeta;
  documents: IAddressDocuments[];
}

export const searchPlaceWithAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<IAddress> | undefined> => {
  try {
    const result: AxiosResponse<IAddressSearchResult> = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        req.params.placeAddress
      )}`,
      kakaoConfig
    );

    const addresses = result.data.documents.map((address, index) => {
      const obj: IAddress = {};
      obj.idx = index;
      obj.address_name = address.address_name;
      obj.place_name = address.road_address.building_name;
      obj.lng = address.x;
      obj.lat = address.y;
      return obj;
    });

    return res.status(200).send(addresses);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const searchPlaceWithKeyWord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<IAddress> | undefined> => {
  try {
    const result: AxiosResponse<IAddressSearchResult> = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURI(
        req.params.placeName
      )}`,
      kakaoConfig
    );

    const addresses = result.data.documents.map((address, index) => {
      const obj: IAddress = {};
      obj.idx = index;
      obj.address_name = address.address_name;
      obj.place_name = address.place_name;
      obj.lng = address.x;
      obj.lat = address.y;
      return obj;
    });

    return res.status(200).send(addresses);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
