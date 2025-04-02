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

// // 타입 가드: 사용자가 관리자인지 확인하는 함수
// export function isAdmin(user: User | null): boolean {
//   return !!user && user.is_admin;
// }

// // 타입 가드: 사용자가 보호소 관리자인지 확인하는 함수 (보호소 ID가 있는 경우)
// export function isShelterAdmin(user: User | null): boolean {
//   return !!user && user.is_admin && !!user.shelter_id;
// }

// // 사용자 타입 상수 (필요할 경우)
// export const USER_TYPES = {
//   REGULAR: 'regular',
//   ADMIN: 'admin',
//   SHELTER_ADMIN: 'shelter_admin',
// } as const;

// export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

// // 사용자 타입 판별 함수
// export function getUserType(user: User | null): UserType | null {
//   if (!user) return null;

//   if (user.is_admin) {
//     return user.shelter_id ? USER_TYPES.SHELTER_ADMIN : USER_TYPES.ADMIN;
//   }

//   return USER_TYPES.REGULAR;
// }
