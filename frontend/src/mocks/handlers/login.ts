import { http, HttpResponse } from 'msw';
import type { RequestHandler } from 'msw';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const loginHandlers: RequestHandler[] = [
  // 카카오 인증 요청 핸들러
  http.get('https://kauth.kakao.com/oauth/authorize', ({ request }) => {
    const url = new URL(request.url);
    console.log('Mock intercepted Kakao auth:', url.toString());

    // 로컬 callback 페이지로 리다이렉트
    return HttpResponse.redirect(
      'http://localhost:3000/yoohoo/login/callback?code=mock_code'
    );
  }),

  // user-info 핸들러 수정
  // 사용자 정보 조회 핸들러 (더 포괄적인 패턴 사용)
  http.get('https://j12b209.p.ssafy.io/api/auth/user-info', () => {
    console.log('Mock intercepted user-info request from full URL');
    return HttpResponse.json({
      userId: 1,
      nickname: '테스트 유저',
      kakaoEmail: 'test@example.com',
      isAdmin: true,
      shelterId: null,
      createdAt: new Date().toISOString(),
    });
  }),

  // 상대 경로 매칭 (백업용)
  http.get('/api/auth/user-info', () => {
    console.log('Mock intercepted user-info request from relative path');
    return HttpResponse.json({
      userId: 1,
      nickname: '테스트 유저',
      kakaoEmail: 'test@example.com',
      isAdmin: true,
      shelterId: null,
      createdAt: new Date().toISOString(),
    });
  }),
];
