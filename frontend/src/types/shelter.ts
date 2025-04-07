// 보호소 상세 정보 타입
export interface ShelterDetail {
  shelterId: number;
  name: string;
  address: string;
  foundationDate: string;
  content: string;
  email: string;
  phone: string;
  businessNumber: string;
  reliability: number;
  imageUrl: string;
  reliabilityPercentage: number; // 추가된 것
}

export interface Shelter {
  shelterId: number;
  name: string;
  content: string;
  dogCount: number;
  reliability: number;
  imageUrl: string;
}

export interface ShelterAccountInfo {
  accountNo: string;
  bankName: string;
}
