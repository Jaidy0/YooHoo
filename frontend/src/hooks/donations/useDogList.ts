'use client';

import { useState, useEffect } from 'react';
import { getDogList } from '@/api/dogs/dogs';
import { Dog } from '@/types/dog';

export const useDogList = (shelterId: number, searchTerm: string = '') => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      if (!shelterId) {
        setDogs([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = searchTerm ? { search: searchTerm } : {};
        const response = await getDogList(shelterId, params);
        setDogs(response.data || []);
      } catch (err) {
        console.error('강아지 목록 로딩 에러:', err);
        setError('강아지 목록을 불러오는데 실패했습니다.');
        setDogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, [shelterId, searchTerm]);

  return {
    dogs,
    isLoading,
    error,
  };
};
