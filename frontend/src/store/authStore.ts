// store/authStore.ts
import { create } from 'zustand';
import { User } from '@/types/user';
import { fetchCurrentUser, logoutUser } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkAuthStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
}

function createAuthStore() {
  return create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    checkAuthStatus: async () => {
      try {
        set({ isLoading: true, error: null });
        console.log('로딩 상태 변경 후:', get());

        const userData = await fetchCurrentUser();

        if (userData) {
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          // 상태 업데이트 후 현재 상태 로깅
          console.log('인증 성공 후 상태:', get());
          return true;
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });

          // 상태 업데이트 후 현재 상태 로깅
          console.log('인증 실패 후 상태:', get());
          return false;
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: '인증 확인 중 오류가 발생했습니다.',
        });

        // 에러 상태 업데이트 후 현재 상태 로깅
        console.log('인증 에러 후 상태:', get());
        return false;
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
