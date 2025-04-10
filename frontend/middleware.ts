import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증이 필요한 경로 설정
const protectedPaths = ['/yoohoo/donate', '/yoohoo/profile', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호된 경로인지 확인
  if (protectedPaths.some((path) => pathname?.startsWith(path))) {
    // 쿠키에서 인증 상태 확인
    const isAuthenticated = request.cookies.has('auth_token'); // 실제 사용하는 쿠키 이름으로 변경

    if (!isAuthenticated) {
      // 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/yoohoo/login/kakao', request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/yoohoo/:path*'],
};
