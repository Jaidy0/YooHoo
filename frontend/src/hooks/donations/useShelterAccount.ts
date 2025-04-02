import { useState, useEffect } from 'react';
import { getShelterAccountInfo } from '@/api/donations/account';
import { ShelterAccountInfo } from '@/types/shelter';

export const useShelterAccount = (shelterId: number) => {
  const [accountInfo, setAccountInfo] = useState<ShelterAccountInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccountInfo = async () => {
      if (!shelterId) {
        setAccountInfo(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getShelterAccountInfo(shelterId);
        setAccountInfo(data);
      } catch (err) {
        setError('단체 계좌 정보를 불러오는데 실패했습니다.');
        console.error('단체 계좌 정보 로딩 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountInfo();
  }, [shelterId]);

  return {
    accountInfo,
    isLoading,
    error,
  };
};
