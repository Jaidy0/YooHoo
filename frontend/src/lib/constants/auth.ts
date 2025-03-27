// const KAKAO_AUTH_URL =
//   'https://kauth.kakao.com/oauth/authorize?client_id=0fd06d3411cbcfb4f97b0eb93baedd48&redirect_uri=https://j12b209.p.ssafy.io/api/auth/kakao-login&response_type=code';

export const REST_API_KEY = '0fd06d3411cbcfb4f97b0eb93baedd48';

export const KAKAO_REDIRECT_URI =
  'https://j12b209.p.ssafy.io/api/auth/kakao-login';

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
