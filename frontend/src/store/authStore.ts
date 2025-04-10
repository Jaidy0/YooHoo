// store/authStore.ts
import { create } from 'zustand';
import { User } from '@/types/user';
import { fetchCurrentUser, logoutUser } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuthStatus: () => Promise<{
    isAuthenticated: boolean;
    isAdmin: boolean;
  }>;
  logout: () => Promise<void>;
}

function createAuthStore() {
  return create<AuthState>((set, get) => ({
    user: null, // 유저정보 (createAt, nickname, kakaoEmail, isAdmin, shelterId, userId)
    isAuthenticated: false,
    isLoading: true,
    error: null,

    checkAuthStatus: async () => {
      try {
        set({ isLoading: true, error: null });

        // 1. API 호출
        const userData = await fetchCurrentUser();
        console.log('checkAuthStatus ### createAuthStore userData', userData);

        if (!userData) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          console.log('유저정보가 없습니다. 로그아웃 상태');

          return { isAuthenticated: false, isAdmin: false };
        }

        // 2. nickname이 null인 경우 '후원자'로 설정
        console.log('로그인 상태네요');

        const processedUserData = {
          ...userData,
          nickname: userData.nickname || '후원자',
        };

        // 3 상태 업데이트
        set({
          user: processedUserData,
          isAuthenticated: true,
          isLoading: false,
        });

        // 4. 상태 업데이트 완료 대기
        await new Promise<void>((resolve) => {
          set((state) => {
            resolve();
            return state;
          });
        });

        // 4. 최종 상태 확인 후 반환
        const currentState = get();
        return {
          isAuthenticated: currentState.isAuthenticated,
          isAdmin: currentState.user?.isAdmin || false,
        };
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: '인증 확인 중 오류가 발생했습니다.',
        });
        return { isAuthenticated: false, isAdmin: false };
      }
    },

    logout: async () => {
      try {
        set({ isLoading: true, error: null });
        console.log('로그아웃 로딩 시작 후 상태:', get());

        const success = await logoutUser();

        if (success) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });

          // 로그아웃 성공 후 상태 로깅
          console.log('로그아웃 성공 후 상태:', get());
        } else {
          set({
            isLoading: false,
            error: '로그아웃 중 오류가 발생했습니다.',
          });

          // 로그아웃 실패 후 상태 로깅
          console.log('로그아웃 실패 후 상태:', get());
        }
      } catch (error) {
        console.error('로그아웃 실패:', error);
        set({
          isLoading: false,
          error: '로그아웃 중 오류가 발생했습니다.',
        });

        // 로그아웃 에러 후 상태 로깅
        console.log('로그아웃 에러 후 상태:', get());
      }
    },
  }));
}

export const useAuthStore = createAuthStore();
