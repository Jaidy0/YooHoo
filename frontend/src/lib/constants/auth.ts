export const REST_API_KEY = '0fd06d3411cbcfb4f97b0eb93baedd48';

export const KAKAO_REDIRECT_URI =
  'http://localhost:8080/api/auth/kakao-login&response_type=code';

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
