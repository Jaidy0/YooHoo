import { useState } from 'react';
import { updateUserNickname } from '@/api/user/nickname';
import { useAuthStore } from '@/store/authStore';

export const useUpdateNickname = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, checkAuthStatus } = useAuthStore();

  const updateNickname = async (newNickname: string) => {
    if (!user || !user.userId) {
      setError('사용자 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // API 호출
      await updateUserNickname(user.userId, newNickname);

      // 사용자 정보 갱신 (store에서 제공하는 checkAuthStatus 사용)
      await checkAuthStatus();

      return true;
    } catch (err) {
      console.error('닉네임 업데이트 실패:', err);

      // 에러 메시지 처리
      let errorMessage = '닉네임 업데이트 중 오류가 발생했습니다.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateNickname,
    isLoading,
    error,
  };
};
