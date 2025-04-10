'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, FormEvent } from 'react';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/buttons/Button/Button';
import RatingScale from '@/components/common/RatingScale/RatingScale';
import styles from './page.module.scss';
import { useDogRegister } from '@/hooks/useDogRegister';
import { DogRegisterData } from '@/api/dogs/dogs';
import { DogStatus, Gender } from '@/types/dog';

export default function DogsRegisterPage() {
  const router = useRouter();
  const { registerDogInfo, isRegistering, registerError } = useDogRegister();

  // 폼 상태 관리
  const [formState, setFormState] = useState({
    dogImage: null as File | null,
    name: '',
    status: '보호 중',
    gender: '남',
    age: '',
    weight: '',
    breed: '',

    energetic: 3,
    familiarity: 1,
    isNeutered: '미완',
    isVaccinated: '미완',
  });

  // 에러 상태 관리
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // 입력 필드 변경 핸들러
  const handleInputChange = useCallback(
    (field: keyof typeof formState, value: string | number | File | null) => {
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

  // 라디오 버튼 클릭 핸들러를 생성하는 함수
  const createRadioHandler = useCallback(
    (stateSetter: (value: string) => void) => (value: string) => {
      stateSetter(value);
    },
    []
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

      energetic: 3,
      familiarity: 1,
      isNeutered: '미완',
      isVaccinated: '미완',
    });
    setErrors({});
  }, []);

  // 상태 코드 변환 함수
  const getStatusCode = (status: string): DogStatus => {
    const statusMap: Record<string, DogStatus> = {
      '보호 중': DogStatus.PROTECTED,
      '임시 보호 중': DogStatus.TEMPORARY,
      '입양 완료': DogStatus.ADOPTED,
      사망: DogStatus.DECEASED,
    };
    return statusMap[status] ?? DogStatus.PROTECTED;
  };

  // 완료 상태 변환 함수
  const getCompletionStatus = (status: string): boolean => {
    return status === '완료';
  };

  // 폼 제출 핸들러
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const {
        dogImage,
        name,
        status,
        gender,
        age,
        weight,
        breed,

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
        gender: gender === '남' ? Gender.MALE : Gender.FEMALE,
        breed,
        energetic,
        familiarity,
        isVaccination: getCompletionStatus(isVaccinated),
        isNeutered: getCompletionStatus(isNeutered),
        status: getStatusCode(status),
      };

      // API 호출
      await registerDogInfo(dogData, dogImage);
      router.push('/admin/dogs/success');
    } catch (error) {
      console.error(error);
      alert(
        registerError || '강아지 정보 등록에 실패했습니다. 다시 시도해주세요.'
      );
    }
  };

  // Button을 라디오 버튼처럼 사용하기 위한 렌더링 함수
  const renderOptionButtons = (
    options: string[],
    currentValue: string,
    fieldName: keyof typeof formState,
    onChange: (value: string) => void
  ) => {
    return options.map((option) => (
      <Button
        key={option}
        variant={currentValue === option ? 'primary' : 'outline'}
        size='sm'
        onClick={() => {
          onChange(option);
          handleInputChange(fieldName, option);
        }}
        className={styles.optionButton}
        type='button'
      >
        {option}
      </Button>
    ));
  };

  return (
    <div className={styles.dogsPage}>
      <div className={styles.adminCard}>
        <div className={styles.headerActions}>
          <h1 className={styles.pageTitle}>강아지 정보 관리</h1>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.formContent}>
            <div className={styles.imageSection}>
              <ImageUpload
                value={formState.dogImage}
                onChange={handleImageUpload}
                onError={handleImageError}
                error={errors.dogImage}
                uploadText='강아지 사진을 업로드해주세요'
              />
            </div>

            <div className={styles.formFields}>
              <Input
                title='이름'
                placeHolder='이름을 입력해주세요.'
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                hasError={!!errors.name}
                errorMessage={errors.name}
              />

              <Input
                title='견종'
                placeHolder='견종을 입력해주세요.'
                value={formState.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                hasError={!!errors.breed}
                errorMessage={errors.breed}
              />

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>상태</label>
                <div className={styles.buttonGroup}>
                  {renderOptionButtons(
                    ['보호 중', '임시 보호 중', '입양 완료', '사망'],
                    formState.status,
                    'status',
                    createRadioHandler((value) =>
                      handleInputChange('status', value)
                    )
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>성별</label>
                <div className={styles.buttonGroup}>
                  {renderOptionButtons(
                    ['남', '여'],
                    formState.gender,
                    'gender',
                    createRadioHandler((value) =>
                      handleInputChange('gender', value)
                    )
                  )}
                </div>
              </div>

              <Input
                title='나이(연령)'
                placeHolder='나이를 입력해주세요.'
                type='number'
                value={formState.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                hasError={!!errors.age}
                errorMessage={errors.age}
              />

              <Input
                title='체중(kg)'
                placeHolder='체중을 입력해주세요.'
                type='number'
                value={formState.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                hasError={!!errors.weight}
                errorMessage={errors.weight}
              />

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>활발함</label>
                <RatingScale
                  value={formState.energetic}
                  onChange={(value) => handleInputChange('energetic', value)}
                  maxRating={5}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>친화력</label>
                <RatingScale
                  value={formState.familiarity}
                  onChange={(value) => handleInputChange('familiarity', value)}
                  maxRating={5}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>중성화 여부</label>
                <div className={styles.buttonGroup}>
                  {renderOptionButtons(
                    ['미완', '완료'],
                    formState.isNeutered,
                    'isNeutered',
                    createRadioHandler((value) =>
                      handleInputChange('isNeutered', value)
                    )
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>접종 여부</label>
                <div className={styles.buttonGroup}>
                  {renderOptionButtons(
                    ['미완', '완료'],
                    formState.isVaccinated,
                    'isVaccinated',
                    createRadioHandler((value) =>
                      handleInputChange('isVaccinated', value)
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              variant='outline'
              onClick={handleReset}
              type='button'
              disabled={isRegistering}
            >
              취소하기
            </Button>
            <Button variant='primary' type='submit' disabled={isRegistering}>
              {isRegistering ? '처리 중...' : '등록하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
