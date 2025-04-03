import axios from 'axios';

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
  transactionBalance: string;
  transactionAfterBalance: string;
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
  try {
    const response = await axios.post<WithdrawalResponse>(
      '/api/bankbook/withdrawal',
      params
    );
    return response.data;
  } catch (error) {
    console.error('통장 출금 내역 조회 중 오류가 발생했습니다:', error);
    throw error;
  }
};
