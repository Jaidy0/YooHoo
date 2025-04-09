// src/auth/auth.ts

import axios from 'axios';

// 상수 정의
const API_KEY = '54cc585638ea49a5b13f7ec7887c7c1b';
const BASE_URL = 'https://finopenapi.ssafy.io/ssafy/api/v1';
const URLS = {
  MEMBER: `${BASE_URL}/member`,
  ACCOUNT: `${BASE_URL}/edu/demandDeposit/createDemandDepositAccount`,
  DEPOSIT: `${BASE_URL}/edu/demandDeposit/updateDemandDepositAccountDeposit`,
} as const;

const CONSTANTS = {
  ACCOUNT_TYPE_NO: '999-1-b9744b3c37a243',
  INSTITUTION_CODE: '00100',
  FINTECH_APP_NO: '001',
  API_SERVICE_CODE_CREATE: 'createDemandDepositAccount',
  API_SERVICE_CODE_DEPOSIT: 'updateDemandDepositAccountDeposit',
} as const;

// 타입 정의
interface User {
  name: string;
  email: string;
}

// API 응답 타입들
interface CreateUserResponse {
  userId: string;
  userName: string;
  institutionCode: string;
  userKey: string;
  created: string;
  modified: string;
}

interface Currency {
  currency: string;
  currencyName: string;
}

interface CreateAccountResponseRec {
  bankCode: string;
  accountNo: string;
  currency: Currency;
}

interface DepositResponseRec {
  transactionUniqueNo: string;
  transactionDate: string;
}

interface ApiHeader {
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

interface ApiResponse<T> {
  Header: ApiHeader;
  REC: T;
}

// 유틸리티 함수
const generateTransactionId = (): string => {
  const now = new Date();
  const dateStr = now
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14);
  const random = Math.floor(Math.random() * 900000 + 100000);
  return `${dateStr}${random}`;
};

const getNow = (): { date: string; time: string } => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  return { date, time };
};

// API 함수
export const createUser = async (
  email: string
): Promise<CreateUserResponse> => {
  try {
    const response = await axios.post<CreateUserResponse>(URLS.MEMBER, {
      apiKey: API_KEY,
      userId: email,
    });
    return response.data;
  } catch (error) {
    console.error('사용자 생성 실패:', error);
    throw error;
  }
};

export const createAccount = async (
  userKey: string
): Promise<ApiResponse<CreateAccountResponseRec>> => {
  try {
    const { date, time } = getNow();
    const response = await axios.post<ApiResponse<CreateAccountResponseRec>>(
      URLS.ACCOUNT,
      {
        Header: {
          apiName: CONSTANTS.API_SERVICE_CODE_CREATE,
          transmissionDate: date,
          transmissionTime: time,
          institutionCode: CONSTANTS.INSTITUTION_CODE,
          fintechAppNo: CONSTANTS.FINTECH_APP_NO,
          apiServiceCode: CONSTANTS.API_SERVICE_CODE_CREATE,
          institutionTransactionUniqueNo: generateTransactionId(),
          apiKey: API_KEY,
          userKey,
        },
        accountTypeUniqueNo: CONSTANTS.ACCOUNT_TYPE_NO,
      }
    );

    if (response.data.Header.responseCode !== 'H0000') {
      throw new Error(response.data.Header.responseMessage);
    }

    return response.data;
  } catch (error) {
    console.error('계좌 생성 실패:', error);
    throw error;
  }
};

export const depositToAccount = async (
  userKey: string,
  accountNo: string,
  amount: string = '1000000',
  description: string = '초기 후원 입금'
): Promise<ApiResponse<DepositResponseRec>> => {
  try {
    const { date, time } = getNow();
    const response = await axios.post<ApiResponse<DepositResponseRec>>(
      URLS.DEPOSIT,
      {
        Header: {
          apiName: CONSTANTS.API_SERVICE_CODE_DEPOSIT,
          transmissionDate: date,
          transmissionTime: time,
          institutionCode: CONSTANTS.INSTITUTION_CODE,
          fintechAppNo: CONSTANTS.FINTECH_APP_NO,
          apiServiceCode: CONSTANTS.API_SERVICE_CODE_DEPOSIT,
          institutionTransactionUniqueNo: generateTransactionId(),
          apiKey: API_KEY,
          userKey,
        },
        accountNo,
        transactionBalance: amount,
        transactionSummary: description,
      }
    );

    if (response.data.Header.responseCode !== 'H0000') {
      throw new Error(response.data.Header.responseMessage);
    }

    return response.data;
  } catch (error) {
    console.error('입금 실패:', error);
    throw error;
  }
};

// 통합 함수
export const processUserAccount = async (
  user: User
): Promise<{
  name: string;
  email: string;
  userKey: string;
  accountNo: string;
  bankCode: string;
  currency: Currency;
  transactionInfo?: {
    transactionUniqueNo: string;
    transactionDate: string;
  };
}> => {
  try {
    // 사용자 생성
    const userData = await createUser(user.email);

    // 계좌 생성
    const accountData = await createAccount(userData.userKey);

    // 입금 처리
    const depositData = await depositToAccount(
      userData.userKey,
      accountData.REC.accountNo
    );

    return {
      name: user.name,
      email: user.email,
      userKey: userData.userKey,
      accountNo: accountData.REC.accountNo,
      bankCode: accountData.REC.bankCode,
      currency: accountData.REC.currency,
      transactionInfo: {
        transactionUniqueNo: depositData.REC.transactionUniqueNo,
        transactionDate: depositData.REC.transactionDate,
      },
    };
  } catch (error) {
    console.error(`${user.name} (${user.email}) 처리 중 오류 발생:`, error);
    throw error;
  }
};

// 사용 예시:
/*
const processUsers = async () => {
  const users: User[] = [
    { name: "1", email: "yoohoo2@naver.com" },
  ];

  const results = [];
  
  for (const user of users) {
    try {
      const result = await processUserAccount(user);
      results.push(result);
      await new Promise(resolve => setTimeout(resolve, 1000)); // rate limit 방지
    } catch (error) {
      console.error(`Failed to process user ${user.name}:`, error);
    }
  }

  console.log("===== 처리 결과 =====");
  console.log(results);
};
*/
