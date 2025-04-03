import axios from 'axios';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

// 통장 출금 관련 인터페이스
interface WithdrawalRequestParams {
  transactionUniqueNo: number;
  shelterId: number;
}

interface WithdrawalResponseHeader {
  responseCode: string;
  responseMessage: string;
  apiName: string;
  transmissionDate: string;
  transmissionTime: string;
  institutionCode: string;
  apiKey: string;
  apiServiceCode: string;
  institutionTransactionUniqueNo: string;
}

interface WithdrawalResponseRecord {
  transactionUniqueNo: string;
  transactionDate: string;
  transactionTime: string;
  transactionType: string;
  transactionTypeName: string;
  transactionAccountNo: string;
  transactionBalance: number;
  transactionAfterBalance: number;
  transactionSummary: string;
  transactionMemo: string;
}

export interface WithdrawalResponse {
  Header: WithdrawalResponseHeader;
  REC: WithdrawalResponseRecord;
}

/**
 * 통장 출금 내역 조회 API
 * @param params - 요청 파라미터 (거래번호, 보호소ID)
 * @returns 통장 출금 내역 응답 데이터
 */
export const fetchBankbookWithdrawal = async (
  params: WithdrawalRequestParams
): Promise<WithdrawalResponse> => {
  const response = await axios.post<WithdrawalResponse>(
    `${API_BASE_URL}/api/bankbook/withdrawal`,
    params
  );

  return response.data;
};

// 카드 증빙 관련 인터페이스
interface CardWithdrawalRequest {
  shelterId: number;
}

export interface CardTransaction {
  transactionUniqueNo: number;
  cardNumber: string;
  transactionDate: string;
  transactionTime: string;
  merchantName: string;
  transactionAmount: number;
  approvalCode: string;
  cardType: string;
  transactionCategory: string;
  transactionStatus: string;
}

export interface CardWithdrawalResponse {
  code: number;
  message: string;
  data: CardTransaction[];
}

/**
 * 카드 내역 조회 API
 * @param params - 요청 파라미터 (보호소ID)
 * @returns 카드 내역 응답 데이터
 */
export const fetchCardWithdrawal = async (
  params: CardWithdrawalRequest
): Promise<CardWithdrawalResponse> => {
  const response = await axios.post<CardWithdrawalResponse>(
    `${API_BASE_URL}/api/card/withdrawal`,
    params
  );

  return response.data;
};
