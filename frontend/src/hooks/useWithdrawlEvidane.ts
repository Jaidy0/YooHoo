import { useState, useEffect, useCallback } from 'react';
import {
  fetchBankbookWithdrawal,
  WithdrawalResponse,
} from '@/api/donations/evidence';

// 공통 트랜잭션 필드 정의 (응답으로 오는 데이터 형식)
interface TransactionFields {
  transactionUniqueNo: string;
  transactionDate: string;
  transactionTime: string;
  transactionType: string;
  transactionTypeName: string;
  transactionAccountNo: string;
  transactionBalance: string; // 문자열 형태로 통일
  transactionAfterBalance: string; // 문자열 형태로 통일
  transactionSummary: string;
  transactionMemo: string;
}

// 훅에서 사용할 트랜잭션 타입 (단일 레코드와 리스트의 항목 모두에 사용)
type Transaction = TransactionFields;

// 리스트 형태의 REC 타입 정의
interface WithdrawalResponseRecWithList {
  totalCount: string;
  list: Array<TransactionFields>;
}

// 실제로 받아오는 리스트 형태의 응답 인터페이스
interface ActualWithdrawalResponse {
  Header: {
    responseCode: string;
    responseMessage: string;
    apiName: string;
    transmissionDate: string;
    transmissionTime: string;
    institutionCode: string;
    apiKey: string;
    apiServiceCode: string;
    institutionTransactionUniqueNo: string;
  };
  REC: WithdrawalResponseRecWithList;
}

interface UseBankbookWithdrawalParams {
  transactionUniqueNo: number;
  shelterId: number;
  enabled?: boolean;
}

type ResponseType = WithdrawalResponse | ActualWithdrawalResponse;

interface UseBankbookWithdrawalResult {
  data: ResponseType | null;
  filteredTransaction: Transaction | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 통장 출금 내역 조회 훅
 * @param params - 요청 파라미터 (거래번호, 보호소ID, 활성화 여부)
 * @returns 로딩 상태, 데이터, 필터링된 거래, 에러, 재조회 함수
 */
export const useBankbookWithdrawal = ({
  transactionUniqueNo,
  shelterId,
  enabled = true,
}: UseBankbookWithdrawalParams): UseBankbookWithdrawalResult => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [filteredTransaction, setFilteredTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !transactionUniqueNo || !shelterId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchBankbookWithdrawal({
        transactionUniqueNo,
        shelterId,
      });

      setData(response);

      // 타입 가드 함수: 응답이 리스트 형태인지 확인
      const isListResponse = (
        rec: unknown
      ): rec is WithdrawalResponseRecWithList => {
        return typeof rec === 'object' && rec !== null && 'list' in rec;
      };

      if (isListResponse(response.REC)) {
        // 리스트 형태인 경우 - transactionUniqueNo에 맞는 항목 찾기
        // 타입 가드 덕분에 타입 단언이 필요 없어짐
        const recWithList = response.REC;
        const matchingTransaction = recWithList.list.find(
          (transaction) =>
            String(transaction.transactionUniqueNo) ===
            String(transactionUniqueNo)
        );

        setFilteredTransaction(matchingTransaction || null);
      } else {
        // 단일 거래 정보인 경우 - 타입 변환이 필요함
        // transactionBalance와 transactionAfterBalance의 타입 불일치를 해결하기 위해
        // 원본 객체를 복사하면서 타입을 조정합니다

        const originalRec = response.REC;
        const convertedTransaction: Transaction = {
          transactionUniqueNo: originalRec.transactionUniqueNo,
          transactionDate: originalRec.transactionDate,
          transactionTime: originalRec.transactionTime,
          transactionType: originalRec.transactionType,
          transactionTypeName: originalRec.transactionTypeName,
          transactionAccountNo: originalRec.transactionAccountNo,
          // 숫자인 경우 문자열로 변환
          transactionBalance: originalRec.transactionBalance.toString(),
          transactionAfterBalance:
            originalRec.transactionAfterBalance.toString(),
          transactionSummary: originalRec.transactionSummary,
          transactionMemo: originalRec.transactionMemo,
        };

        setFilteredTransaction(convertedTransaction);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('알 수 없는 오류가 발생했습니다.')
      );
    } finally {
      setIsLoading(false);
    }
  }, [transactionUniqueNo, shelterId, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, filteredTransaction, isLoading, error, refetch };
};
