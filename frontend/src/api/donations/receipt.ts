import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface UploadReceiptResponse {
  url: string;
}

/**
 * 영수증 이미지 업로드 API
 * @param withdrawId 출금 ID
 * @param file 업로드할 영수증 이미지 파일
 */
export const uploadReceipt = async (
  withdrawId: number,
  file: File
): Promise<UploadReceiptResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<UploadReceiptResponse>(
    `${BASE_URL}/api/withdrawal/${withdrawId}/imageupload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * 영수증 삭제 API
 * @param withdrawId 출금 ID
 */
export const deleteReceipt = async (
  withdrawId: number
): Promise<{ success: boolean }> => {
  const response = await axios.delete<{ success: boolean }>(
    `${BASE_URL}/api/withdrawal/${withdrawId}/receipt`
  );

  return response.data;
};
