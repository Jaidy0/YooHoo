import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  // 액션들
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  kakaoLogin: (code: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,
      isAuthenticated: false,
      accessToken: null,

      // 액션들
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAccessToken: (token) => set({ accessToken: token }),

      login: (token, user) =>
        set({
          accessToken: token,
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      kakaoLogin: async (code: string) => {
        try {
          const response = await fetch('/api/auth/kakao-callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error('카카오 로그인 실패');
          }

          const data = await response.json();

          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('카카오 로그인 에러:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 키 이름
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
