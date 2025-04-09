// app/api/proxy/member/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

const API_KEY = '54cc585638ea49a5b13f7ec7887c7c1b';
const BASE_URL = 'https://finopenapi.ssafy.io/ssafy/api/v1';

export async function POST(request: NextRequest) {
  try {
    console.log('[Member] POST 요청 받음');

    // request.json()을 사용하여 요청 본문 파싱
    const body = await request.json();
    const { email, name } = body;

    console.log('[Member] 요청 본문:', { email, name });

    if (!email || !name) {
      console.error('[Member] 필수 데이터 누락:', { email, name });
      return NextResponse.json(
        { error: '이메일과 이름은 필수입니다.' },
        { status: 400 }
      );
    }

    // 사용자 생성
    console.log('[Member] 사용자 생성 시도:', { email, name });
    const userResponse = await axios.post(`${BASE_URL}/member`, {
      apiKey: API_KEY,
      userId: email,
    });
    console.log('[Member] 사용자 생성 응답:', userResponse.data);

    const userKey = userResponse.data.userKey;

    // 계좌 생성
    console.log('[Member] 계좌 생성 시도:', { userKey });
    const accountResponse = await axios.post(
      `${BASE_URL}/edu/demandDeposit/createDemandDepositAccount`,
      {
        Header: {
          apiName: 'createDemandDepositAccount',
          transmissionDate: new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, ''),
          transmissionTime: new Date()
            .toTimeString()
            .slice(0, 8)
            .replace(/:/g, ''),
          institutionCode: '00100',
          fintechAppNo: '001',
          apiServiceCode: 'createDemandDepositAccount',
          institutionTransactionUniqueNo: `${Date.now()}${Math.floor(Math.random() * 900000 + 100000)}`,
          apiKey: API_KEY,
          userKey,
        },
        accountTypeUniqueNo: '999-1-b9744b3c37a243',
      }
    );
    console.log('[Member] 계좌 생성 응답:', accountResponse.data);

    const accountNo = accountResponse.data.REC.accountNo;

    // 입금 처리
    console.log('[Member] 입금 처리 시도:', { accountNo });
    const depositResponse = await axios.post(
      `${BASE_URL}/edu/demandDeposit/updateDemandDepositAccountDeposit`,
      {
        Header: {
          apiName: 'updateDemandDepositAccountDeposit',
          transmissionDate: new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, ''),
          transmissionTime: new Date()
            .toTimeString()
            .slice(0, 8)
            .replace(/:/g, ''),
          institutionCode: '00100',
          fintechAppNo: '001',
          apiServiceCode: 'updateDemandDepositAccountDeposit',
          institutionTransactionUniqueNo: `${Date.now()}${Math.floor(Math.random() * 900000 + 100000)}`,
          apiKey: API_KEY,
          userKey,
        },
        accountNo,
        transactionBalance: '1000000',
        transactionSummary: '초기 후원 입금',
      }
    );
    console.log('[Member] 입금 처리 응답:', depositResponse.data);

    const result = {
      name,
      email,
      userKey,
      accountNo,
      bankCode: accountResponse.data.REC.bankCode,
      currency: accountResponse.data.REC.currency,
      transactionInfo: {
        transactionUniqueNo: depositResponse.data.REC.transactionUniqueNo,
        transactionDate: depositResponse.data.REC.transactionDate,
      },
    };

    console.log('[Member] 최종 응답:', result);
    return NextResponse.json(result);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[Member] API 요청 실패:', {
      message: axiosError.message,
      response: axiosError.response?.data,
      stack: axiosError.stack,
    });

    return NextResponse.json(
      {
        error: 'API 요청 실패',
        details: axiosError.response?.data || axiosError.message,
      },
      { status: 500 }
    );
  }
}
