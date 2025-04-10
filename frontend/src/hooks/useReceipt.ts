import { useState } from 'react';
import {
  uploadReceipt,
  deleteReceipt,
  getReceiptFileUrl,
} from '@/api/donations/receipt';

interface UseReceiptOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onDataChange?: () => void; // 데이터 변경 시 호출될 콜백
}

export const useReceipt = (withdrawId: number, options?: UseReceiptOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const uploadReceiptImage = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      // 파일 업로드 API 호출
      const result = await uploadReceipt(withdrawId, file);

      // 업로드된 파일 URL 저장
      if (result && result.url) {
        setFileUrl(result.url);
        console.log('업로드 완료:', result.url);
      }

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

      // 파일 URL 초기화
      setFileUrl(null);

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

  // 파일 URL 조회 함수 추가
  const fetchFileUrl = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const url = await getReceiptFileUrl(withdrawId);
      setFileUrl(url);
      return url;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('영수증 URL 조회 실패');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadReceiptImage,
    removeReceipt,
    fetchFileUrl,
    fileUrl,
    isLoading,
    error,
  };
};
