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
    console.log('[useProcessUserAccount] 계좌 생성 요청 시작:', userData);

    if (!userData.email || !userData.name) {
      console.error('[useProcessUserAccount] 사용자 정보 누락:', userData);
      setError('사용자 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('[useProcessUserAccount] API 호출 시작');
      const result = await processUserAccount(userData);
      console.log('[useProcessUserAccount] API 호출 성공:', result);

      setResult(result);

      return result;
    } catch (err) {
      console.error('[useProcessUserAccount] API 호출 실패:', err);
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
