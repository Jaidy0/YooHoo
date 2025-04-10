import { useState, useEffect } from 'react';
import { getUserDonatedDogs } from '@/api/donations/donatedDog';
import { Dog } from '@/types/dog';

export const useDonatedDogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonatedDogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserDonatedDogs();
        setDogs(data);
      } catch (err) {
        console.error('후원한 강아지 목록 로딩 에러:', err);
        setError('후원한 강아지 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonatedDogs();
  }, []);

  return { dogs, isLoading, error };
};
