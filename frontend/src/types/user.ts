// types/user.types.ts
export interface User {
  userId: number;
  kakaoEmail: string;
  nickname: string;
  isAdmin: boolean;
  shelterId?: number; // 옵셔널 필드로 설정 (관리자나 보호소 연결된 사용자만 가질 수 있음)
  createdAt: string;
  updatedAt?: string; // 데이터베이스에 있을 수 있는 필드지만 언급되지 않았으므로 옵셔널로 설정
}
