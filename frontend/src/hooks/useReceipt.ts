import { useState } from 'react';
import { uploadReceipt, deleteReceipt } from '@/api/donations/receipt';

interface UseReceiptOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onDataChange?: () => void; // 데이터 변경 시 호출될 콜백
}

export const useReceipt = (withdrawId: number, options?: UseReceiptOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadReceiptImage = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await uploadReceipt(withdrawId, file);

      // API 응답에서 URL 확인 (디버깅용)
      console.log('업로드 완료:', result.url);

      // 데이터 변경 알림 (캐시 무효화 대신)
      options?.onDataChange?.();
      options?.onSuccess?.();
      return result;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('영수증 업로드 실패');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeReceipt = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await deleteReceipt(withdrawId);

      // 데이터 변경 알림 (캐시 무효화 대신)
      options?.onDataChange?.();
      options?.onSuccess?.();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('영수증 삭제 실패');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadReceiptImage,
    removeReceipt,
    isLoading,
    error,
  };
};
