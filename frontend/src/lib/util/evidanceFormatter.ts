export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  // YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환
  return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
};

export const formatTime = (timeString: string): string => {
  if (!timeString) return '-';

  // HHMMSS 형식을 HH:MM:SS 형식으로 변환
  return `${timeString.slice(0, 2)}:${timeString.slice(2, 4)}:${timeString.slice(4, 6)}`;
};

export const formatCurrency = (amount: number): string => {
  if (amount === undefined || amount === null) return '-';

  // 숫자를 원화 표시 형식으로 변환 (천 단위 구분 기호 포함)
  return amount.toLocaleString('ko-KR') + '원';
};

export const formatCardNumber = (cardNumber: string): string => {
  if (!cardNumber) return '-';

  // 카드 번호 마스킹 (예: 1234-56**-****-7890)
  const parts = cardNumber.match(/.{1,4}/g) || [];
  parts[1] = parts[1].substring(0, 2) + '**';
  parts[2] = '****';

  return parts.join('-');
};

export const getCardTypeName = (cardType: string): string => {
  const cardTypes: { [key: string]: string } = {
    CREDIT: '신용카드',
    DEBIT: '체크카드',
    CORPORATE: '법인카드',
    PREPAID: '선불카드',
    OTHER: '기타',
  };

  return cardTypes[cardType] || cardType;
};

export const getTransactionStatusName = (status: string): string => {
  const statusTypes: { [key: string]: string } = {
    APPROVED: '승인됨',
    DECLINED: '거절됨',
    VOIDED: '취소됨',
    PENDING: '처리중',
  };

  return statusTypes[status] || status;
};
