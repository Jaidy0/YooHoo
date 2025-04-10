import axios from 'axios';

export async function createSsafyFinAccount(email: string) {
  try {
    const response = await axios.post(
      '/api/auth/ssafyfin/create',
      {
        email, // 요청 본문에 email 포함
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw new Error('계정 생성에 실패했습니다.');
  }
}
