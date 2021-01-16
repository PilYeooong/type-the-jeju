import { Request, Response } from 'express';
import User from '../models/user';
import { getMe } from './user';

const mockResponse = (): Response => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  } as unknown;
  return res as Response;
};

describe('getMe', () => {
  const next = jest.fn();
  const res = mockResponse();
  const mockRequest = (): Request => {
    const req = {
      user: {
        id: 1,
      },
    } as unknown;
    return req as Request;
  };

  it('로그인이 되어있을 시 (req.user 존재), 내 유저 정보를 반환한다', async () => {
    const req = mockRequest();

    const mockUser = {
      id: 1,
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);
    await getMe(req, res, next);

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockUser);
  });

  it('로그인이 되어 있지 않으면, null을 반환한다.', async () => {
    const mockRequest = (): Request => {
      const req = {} as unknown;
      return req as Request;
    };
    const req = mockRequest();

    await getMe(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(null);
  });

  it('에러 발생시 next()의 인자로 err를 전달한다.', async () => {
    const req = mockRequest();

    const err = new Error();
    User.findOne = jest.fn().mockRejectedValue(err);
    await getMe(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
