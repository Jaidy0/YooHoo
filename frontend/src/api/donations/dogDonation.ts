// src/api/donation/dogDonation.ts
import axios from 'axios';
import { DonationItem, WithdrawalItem } from '@/types/adminDonation';

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://j12b209.p.ssafy.io';

/**
 * 특정 강아지의 후원금 입금 내역 조회 API
 * @param dogId 강아지 ID
 * @returns 입금 내역 목록
 */
export const fetchDogDonations = async (
  dogId: string
): Promise<DonationItem[]> => {
  try {
    const response = await axios.get<DonationItem[]>(
      `${API_BASE_URL}/api/donations/dogs/${dogId}`
    );
    return response.data;
  } catch (error) {
    console.error('강아지 후원금 입금 내역 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 강아지의 후원금 출금 내역 조회 API
 * @param dogId 강아지 ID
 * @returns 출금 내역 목록
 */
export const fetchDogWithdrawals = async (
  dogId: string
): Promise<WithdrawalItem[]> => {
  try {
    const response = await axios.get<WithdrawalItem[]>(
      `${API_BASE_URL}/api/withdrawal/dog/${dogId}`
    );
    return response.data;
  } catch (error) {
    console.error('강아지 후원금 출금 내역 조회 실패:', error);
    throw error;
  }
};
