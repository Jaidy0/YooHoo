// hooks/useDogUpdate.ts
import { useState, useCallback } from 'react';
import { updateDog } from '@/api/dogs/dogs';
import { DogUpdateDto } from '@/types/dog';
import axios from 'axios';

interface UseDogUpdateReturn {
  updateDogInfo: (
    dogId: number,
    dogData: DogUpdateDto,
    dogImage?: File | null
  ) => Promise<unknown>;
  isUpdating: boolean;
  updateError: string | null;
  resetError: () => void;
}

export function useDogUpdate(): UseDogUpdateReturn {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateDogInfo = useCallback(
    async (dogId: number, dogData: DogUpdateDto, dogImage?: File | null) => {
      setIsUpdating(true);
      setUpdateError(null);

      try {
        const result = await updateDog(dogId, dogData, dogImage);
        return result;
      } catch (error) {
        let errorMessage = '강아지 정보 수정에 실패했습니다.';

        if (axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            errorMessage;
        }

        setUpdateError(errorMessage);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const resetError = useCallback(() => {
    setUpdateError(null);
  }, []);

  return {
    updateDogInfo,
    isUpdating,
    updateError,
    resetError,
  };
}
