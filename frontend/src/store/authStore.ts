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

        if (!userData) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return { isAuthenticated: false, isAdmin: false };
        }

        // 2. 상태 업데이트
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });

        // 3. 상태 업데이트 완료 대기
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
          isAdmin: currentState.user?.is_admin || false,
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
