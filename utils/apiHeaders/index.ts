export const naverConfig = {
  headers: {
    'X-NCP-APIGW-API-KEY-ID': `${process.env.NAVER_MAP_CLIENT!}`,
    'X-NCP-APIGW-API-KEY': `${process.env.NAVER_MAP_CLIENT_SECRET!}`,
  },
};

export const kakaoConfig = { headers: { Authorization: `KakaoAK ${process.env.KAKAO_ID!}` } }