// hooks/useDogRegister.ts
import { useState, useCallback } from 'react';
import { registerDog, DogRegisterData } from '@/api/dogs/dogs';
import axios from 'axios';

interface UseDogRegisterReturn {
  registerDogInfo: (
    dogData: DogRegisterData,
    dogImage?: File | null
  ) => Promise<unknown>;
  isRegistering: boolean;
  registerError: string | null;
  resetError: () => void;
}

export function useDogRegister(): UseDogRegisterReturn {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const registerDogInfo = useCallback(
    async (dogData: DogRegisterData, dogImage?: File | null) => {
      setIsRegistering(true);
      setRegisterError(null);

      try {
        const result = await registerDog(dogData, dogImage);
        return result;
      } catch (error) {
        let errorMessage = '강아지 등록에 실패했습니다.';

        if (axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            errorMessage;
        }

        setRegisterError(errorMessage);
        throw error;
      } finally {
        setIsRegistering(false);
      }
    },
    []
  );

  const resetError = useCallback(() => {
    setRegisterError(null);
  }, []);

  return {
    registerDogInfo,
    isRegistering,
    registerError,
    resetError,
  };
}
