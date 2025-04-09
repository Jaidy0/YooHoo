// pages/api/proxy/member.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_KEY = '54cc585638ea49a5b13f7ec7887c7c1b';
const BASE_URL = 'https://finopenapi.ssafy.io/ssafy/api/v1';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { email, name } = req.body;

      // 사용자 생성
      const userResponse = await axios.post(`${BASE_URL}/member`, {
        apiKey: API_KEY,
        userId: email,
      });

      const userKey = userResponse.data.userKey;

      // 계좌 생성
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

      const accountNo = accountResponse.data.REC.accountNo;

      // 입금 처리
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

      res.status(200).json({
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
      });
    } catch (error) {
      console.error('API 요청 실패:', error);
      res.status(500).json({ error: 'API 요청 실패' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
