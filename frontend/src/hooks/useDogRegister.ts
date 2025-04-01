// hooks/useDogRegister.ts
import { useState, useCallback } from 'react';
import { registerDog, DogRegisterData } from '@/api/dogs/dogs';

interface DogRegisterFormState {
  dogImage: File | null;
  name: string;
  status: string;
  gender: string;
  age: string;
  weight: string;
  breed: string;
  health: string;
  energetic: number;
  familiarity: number;
  isNeutered: string;
  isVaccinated: string;
}

interface UseRegisterResult {
  formState: DogRegisterFormState;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleImageUpload: (file: File | null) => void;
  handleImageError: (message: string) => void;
  createRadioHandler: (
    stateSetter: (value: string) => void
  ) => (value: string) => void;
  handleInputChange: (
    field: keyof DogRegisterFormState,
    value: string | number | File | null
  ) => void;
  handleSubmit: (shelterId: number) => Promise<boolean>;
  handleReset: () => void;
  validateForm: () => boolean;
}

const getGenderCode = (gender: string): string => {
  const maleTerms = ['남', '남아', '수컷', 'male', 'm'];
  return maleTerms.includes(gender.toLowerCase()) ? 'M' : 'F';
};

const getStatusCode = (status: string): number => {
  const statusMap: Record<string, number> = {
    '보호 중': 0,
    '입양 예정': 1,
    '입양 완료': 2,
  };
  return statusMap[status] ?? 0;
};

const getCompletionStatus = (status: string): boolean => {
  const completedTerms = ['완료', '완료됨', '예', 'yes', 'y', 'true'];
  return completedTerms.includes(status.toLowerCase());
};

export const useDogRegister = (): UseRegisterResult => {
  // 폼 상태 관리
  const [formState, setFormState] = useState<DogRegisterFormState>({
    dogImage: null,
    name: '',
    status: '보호 중',
    gender: '남',
    age: '',
    weight: '',
    breed: '',
    health: '',
    energetic: 3,
    familiarity: 1,
    isNeutered: '미완',
    isVaccinated: '미완',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    (file: File | null) => {
      setFormState((prev) => ({ ...prev, dogImage: file }));
      if (errors.dogImage) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.dogImage;
          return newErrors;
        });
      }
    },
    [errors]
  );

  // 이미지 업로드 에러 핸들러
  const handleImageError = useCallback((message: string) => {
    setErrors((prev) => ({ ...prev, dogImage: message }));
  }, []);

  // 라디오 버튼 클릭 핸들러를 생성하는 함수
  const createRadioHandler = useCallback(
    (stateSetter: (value: string) => void) => (value: string) => {
      stateSetter(value);
    },
    []
  );

  // 입력 필드 변경 핸들러
  const handleInputChange = useCallback(
    (
      field: keyof DogRegisterFormState,
      value: string | number | File | null
    ) => {
      setFormState((prev) => ({ ...prev, [field]: value }));

      // 에러 메시지 제거
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // 폼 유효성 검사
  const validateForm = useCallback(() => {
    const { dogImage, name, age, weight, breed } = formState;
    const newErrors: Record<string, string> = {};

    if (!dogImage) {
      newErrors.dogImage = '강아지 사진을 업로드해주세요';
    }

    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!age.trim()) {
      newErrors.age = '나이를 입력해주세요';
    } else if (isNaN(Number(age)) || Number(age) <= 0) {
      newErrors.age = '올바른 나이를 입력해주세요';
    }

    if (!weight.trim()) {
      newErrors.weight = '체중을 입력해주세요';
    } else if (isNaN(Number(weight)) || Number(weight) <= 0) {
      newErrors.weight = '올바른 체중을 입력해주세요';
    }

    if (!breed.trim()) {
      newErrors.breed = '견종을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    async (shelterId: number): Promise<boolean> => {
      if (!validateForm()) {
        return false;
      }

      setIsSubmitting(true);

      try {
        const {
          dogImage,
          name,
          status,
          gender,
          age,
          weight,
          breed,
          health,
          energetic,
          familiarity,
          isNeutered,
          isVaccinated,
        } = formState;

        // API 요청에 필요한 데이터 구성
        const dogData: DogRegisterData = {
          name,
          age: Number(age),
          weight: Number(weight),
          gender: getGenderCode(gender),
          breed,
          energetic,
          familiarity,
          isVaccination: getCompletionStatus(isVaccinated),
          isNeutered: getCompletionStatus(isNeutered),
          status: getStatusCode(status),
          health: health || undefined,
        };

        // API 호출
        await registerDog(shelterId, dogData, dogImage);
        return true;
      } catch (error) {
        console.error('강아지 등록 중 오류 발생:', error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, validateForm]
  );

  // 초기화 핸들러
  const handleReset = useCallback(() => {
    setFormState({
      dogImage: null,
      name: '',
      status: '보호 중',
      gender: '남',
      age: '',
      weight: '',
      breed: '',
      health: '',
      energetic: 3,
      familiarity: 1,
      isNeutered: '미완',
      isVaccinated: '미완',
    });
    setErrors({});
  }, []);

  return {
    formState,
    errors,
    isSubmitting,
    handleImageUpload,
    handleImageError,
    createRadioHandler,
    handleInputChange,
    handleSubmit,
    handleReset,
    validateForm,
  };
};
