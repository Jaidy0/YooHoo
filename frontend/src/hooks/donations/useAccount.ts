import { useState, useEffect } from 'react';
import { getUserAccounts } from '@/api/donations/account';
import { AccountInfo } from '@/types/account';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const accountsData = await getUserAccounts();
        setAccounts(accountsData);
      } catch (err) {
        setError('계좌 정보를 불러오는데 실패했습니다.');
        console.error('계좌 정보 로딩 에러:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  return {
    accounts,
    isLoading,
    error,
  };
};
