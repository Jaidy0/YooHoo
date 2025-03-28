export const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '';

export const KAKAO_REDIRECT_URI =
  process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || '';

// 필수 값이 없을 경우 경고 로그
if (!REST_API_KEY || !KAKAO_REDIRECT_URI) {
  console.warn('카카오 인증 관련 환경변수가 설정되지 않았습니다.');
}

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
// export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
