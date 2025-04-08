// lib/util/financeAdapter.ts
import { DonationItem, WithdrawalItem } from '@/api/donations/donation';

// FinanceTable 컴포넌트에서 사용하는 입금 데이터 형식
export interface DepositTableItem {
  type: string;
  name: string | undefined;
  amount: number;
  date: string;
  message: string | undefined;
}

// FinanceTable 컴포넌트에서 사용하는 출금 데이터 형식
export interface WithdrawTableItem {
  withdrawalId: number; // 추가: 출금 ID
  type: string;
  category: string;
  content: string;
  amount: number;
  date: string;
  file_id: string;
  transactionUniqueNo: number; // 추가: 거래 고유 번호
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
      name: item.depositorName || undefined,
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
      withdrawalId: item.withdrawalId, // 추가: 출금 ID 포함
      type,
      category: item.category,
      file_id: item.file_id,
      content: item.content || `${item.category} 지출`, // content가 있으면 사용, 없으면 카테고리로 대체
      amount:
        item.amount !== undefined
          ? item.amount
          : parseInt(item.transactionBalance, 10),
      date,
      transactionUniqueNo: parseInt(item.transactionUniqueNo, 10), // 추가: 거래 고유 번호 (문자열을 숫자로 변환)
    };
  });
};
