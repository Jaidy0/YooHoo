import { useState } from 'react';
import { transferDonation } from '@/api/donations/account';
import { DonationFormData } from '@/types/donation';

export const useDonationSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitDonation = async (formData: DonationFormData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // API 요청 데이터 형식에 맞게 변환
      const apiData: {
        depositAccountNo: string;
        transactionBalance: string;
        withdrawalAccountNo: string;
        cheeringMessage: string;
        depositorName: string;
        donationType: number;
        shelterId: number;
        dogId?: number; // 옵셔널 필드로 선언
      } = {
        depositAccountNo: formData.shelterAccountNumber || '', // 단체 계좌번호
        transactionBalance: formData.amount.toString(), // 금액
        withdrawalAccountNo: formData.accountNumber, // 출금 계좌번호
        cheeringMessage: formData.supportMessage || '', // 응원 메시지
        depositorName: formData.accountName, // 입금자명
        donationType: formData.donationType, // 후원 유형
        shelterId: formData.shelterId, // 단체 ID
      };

      // 강아지 후원인 경우 dogId 추가
      if (formData.targetType === 'dog' && formData.dogId) {
        apiData.dogId = formData.dogId;
      }

      await transferDonation(apiData);
      setIsSuccess(true);
    } catch (err) {
      console.error('후원 제출 에러:', err);
      setError('후원 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitDonation,
    isLoading,
    error,
    isSuccess,
  };
};
