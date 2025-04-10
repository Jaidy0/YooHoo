// types/adminDonation.ts
// 입금 내역 인터페이스
export interface DonationItem {
  donationId: number;
  donationAmount: number;
  transactionUniqueNo: string;
  donationDate: string;
  depositorName: string;
  cheeringMessage: string | null;
  userNickname: string | null;
  dogName: string | null;
  shelterName: string;
  content: string;
}

// 출금 내역 인터페이스
export interface WithdrawalItem {
  date: string;
  withdrawalId: number;
  transactionUniqueNo: string;
  merchantId: number | null;
  name: string;
  transactionBalance: string;
  shelterId: number;
  category: string;
  content?: string;
  amount?: number;
  withdrawalDate?: string; // 삭제 필요
  file_id: string;
  dogId?: number;
  dogName?: string;
  type?: 'SHELTER' | 'DOG'; // 'SHELTER': 단체, 'DOG': 지정(강아지)
  onEvidenceClick?: (transactionUniqueNo: number, type: boolean) => void;
  onReceiptClick?: (withdrawalId: number) => void;
}

// 총 금액 요청 인터페이스
export interface TotalAmountRequest {
  shelterId: number;
}

// 총 금액 응답 인터페이스
export interface TotalAmountResponse {
  totalAmount: number;
}

// 주간 합계 응답 인터페이스
export interface WeeklySumsResponse {
  '5WeeksAgo': number;
  '4WeeksAgo': number;
  '3WeeksAgo': number;
  '2WeeksAgo': number;
  '1WeeksAgo': number;
  ThisWeek: number;
  Prediction: number;
}

// 출금 요청 인터페이스
export interface WithdrawalRequest {
  shelterId: number;
}

// 출금 응답 인터페이스
export interface WithdrawalResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// FinanceTable 컴포넌트에서 사용하는 입금 내역 형식
export interface FormattedDepositItem {
  type: string;
  name: string;
  amount: number;
  date: string;
  message: string;
  depositorName: string;
  content: string;
}

// FinanceTable 컴포넌트에서 사용하는 출금 내역 형식
export interface FormattedWithdrawalItem {
  date: string;
  withdrawalId: number; // 추가: 출금 ID
  transactionUniqueNo: number;
  file_id: string;
  type: string;
  category: string;
  content: string;
  amount: number;
}
