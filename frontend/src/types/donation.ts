// 후원 정보 타입
export interface Donation {
  donationId: number; // long
  userId: number; // long
  shelterId: number; // long
  donationDate: Date; // datetime
  withdrawalAccount: string; // varchar - 출금 계좌번호
  donationType: number; // int - 0: 정기 후원, 1: 일시 후원
  regularDonationDate?: Date; // date - 정기 후원 결제일 (옵션)
  dogId?: number; // long - 강아지 후원인 경우 강아지 ID (옵션)
  depositorName: string; // varchar - 입금자명
  cheeringMessage?: string; // text - 응원 메시지 (옵션)
  donationAmount: number; // int - 후원 금액
  transactionUniqueNo: string; // long - 거래 고유번호
}

// 폼 데이터 타입 (클라이언트 상에서 사용)
export interface DonationFormData {
  shelterId: number; // 단체 ID (shelterId)
  shelterName: string; // 단체 이름 (화면 표시용)
  donationType: 0 | 1; // 0: 정기 후원, 1: 일시 후원
  paymentDay: number; // 정기 결제일 (1-28)
  targetType: 'shelter' | 'dog'; // 단체 또는 강아지 지정 후원 (UI 구분용)
  dogId: number; // 강아지 ID
  dogName: string; // 강아지 이름 (화면 표시용)
  accountName: string; // 입금자명
  accountNumber: string; // 출금 계좌번호
  supportMessage: string; // 응원 메시지
  anonymousDonation: boolean; // 익명 여부
  amount: number; // 후원 금액
}
