// src/utils/financeAdapter.ts

import { DonationItem, WithdrawalItem } from '@/api/donations/donation';

// FinanceTable 컴포넌트에서 사용하는 입금 데이터 형식
export interface DepositTableItem {
  type: string;
  name: string;
  amount: number;
  date: string;
  message: string | undefined;
}

// FinanceTable 컴포넌트에서 사용하는 출금 데이터 형식
export interface WithdrawTableItem {
  type: string;
  category: string;
  content: string;
  amount: number;
  date: string;
  isEvidence: boolean;
  isReceipt: boolean;
}

/**
 * API에서 받은 입금 내역을 FinanceTable 형식으로 변환
 */
export const adaptDonationsToDepositTable = (
  items: DonationItem[]
): DepositTableItem[] => {
  return items.map((item) => {
    // 지정 기부인지 단체 기부인지 판단
    const type = item.dogName ? `지정(${item.dogName})` : '단체';

    return {
      type,
      name: item.shelterName,
      amount: item.donationAmount,
      // YYYY-MM-DD 형식을 YYYY.MM.DD 형식으로 변환
      date: item.donationDate.replace(/-/g, '.'),
      message: item.cheeringMessage || undefined,
    };
  });
};

/**
 * API에서 받은 출금 내역을 FinanceTable 형식으로 변환
 */
export const adaptWithdrawalsToWithdrawTable = (
  items: WithdrawalItem[]
): WithdrawTableItem[] => {
  return items.map((item) => {
    // 단체 출금인지 지정 출금인지 판단
    const type = item.name === '단체' ? '단체' : `지정(${item.name})`;

    // YYYYMMDD 형식을 YYYY.MM.DD 형식으로 변환
    const date = item.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');

    return {
      type,
      category: item.category,
      content: `${item.category} 지출`, // 명확한 컨텐츠 정보가 없는 경우 카테고리로 대체
      amount: parseInt(item.transactionBalance, 10),
      date,
      isEvidence: false, // 임시로 모두 true 처리 (API에서 해당 정보가 없음)
      isReceipt: false, // 임시로 모두 true 처리 (API에서 해당 정보가 없음)
    };
  });
};
