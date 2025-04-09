// src/hooks/useProcessUserAccount.ts

import { useState } from 'react';
import { processUserAccount } from '@/api/auth/auth';

interface ProcessUserAccountResult {
  name: string;
  email: string;
  userKey: string;
  accountNo: string;
  bankCode: string;
  currency: {
    currency: string;
    currencyName: string;
  };
  transactionInfo?: {
    transactionUniqueNo: string;
    transactionDate: string;
  };
}

interface UserData {
  email: string;
  name: string;
}

export const useProcessUserAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessUserAccountResult | null>(null);

  const processAccount = async (userData: UserData) => {
    if (!userData.email || !userData.name) {
      setError('사용자 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await processUserAccount(userData);
      setResult(result);

      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '계좌 생성 중 오류가 발생했습니다.'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processAccount,
    isLoading,
    error,
    result,
  };
};
