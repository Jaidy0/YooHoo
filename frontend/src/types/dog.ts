// types/dog.ts
export enum DogStatus {
  PROTECTED = 0, // 보호
  TEMPORARY = 1, // 임시보호
  ADOPTED = 2, // 입양
  DECEASED = 3, // 사망
}

// 성별 enum
export enum Gender {
  FEMALE = 0, // 여성
  MALE = 1, // 남성
}

// API 응답에 맞춘 강아지 기본 정보 인터페이스
export interface Dog {
  dogId: number;
  name: string;
  age: number;
  weight?: number;
  gender: Gender;
  breed?: string;
  energetic?: number;
  familiarity?: number;
  isVaccination?: boolean;
  isNeutered?: boolean;
  status: DogStatus;
  admissionDate?: string;
  imageUrl: string | null;
  shelterId?: number;
  description?: string;
}

// API 응답 인터페이스 (클라이언트 페이지네이션에 필요한 부분만 유지)
export interface DogResponse {
  data: Dog[];
  total: number;
  totalPages: number;
}

// 단일 강아지 응답 인터페이스
export interface SingleDogResponse {
  data: Dog;
}

// 상태값을 텍스트로 변환하는 유틸리티 함수
export const getStatusText = (status: number): string => {
  switch (status) {
    case DogStatus.PROTECTED:
      return '보호중';
    case DogStatus.TEMPORARY:
      return '임시보호';
    case DogStatus.ADOPTED:
      return '입양완료';
    case DogStatus.DECEASED:
      return '사망';
    default:
      return '알 수 없음';
  }
};

// 성별값을 텍스트로 변환하는 유틸리티 함수
export const getGenderText = (gender: number): string => {
  return gender === Gender.MALE ? '남' : '여';
};

// 강아지 정보 수정 DTO 인터페이스
// Dog 인터페이스에서 dogId와 imageUrl을 제외한 타입 정의
export type DogUpdateDto = Omit<Dog, 'dogId' | 'imageUrl'>;
