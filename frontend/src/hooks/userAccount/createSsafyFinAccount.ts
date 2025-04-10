import { useState } from 'react';
import { createSsafyFinAccount } from '@/api/auth/auth';

// API 응답 타입 정의
interface CreateAccountResponse {
  accountNo: string;
  message: string;
  userKey: string;
}

export function useCreateSsafyFinAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CreateAccountResponse | null>(null);

  const createAccount = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createSsafyFinAccount(email);
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createAccount, isLoading, error, data };
}
