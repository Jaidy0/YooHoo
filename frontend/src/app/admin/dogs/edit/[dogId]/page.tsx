'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/buttons/Button/Button';
import RatingScale from '@/components/common/RatingScale/RatingScale';
import { DogStatus, Gender, DogUpdateDto } from '@/types/dog';
import styles from './page.module.scss';
import { useDog } from '@/hooks/useDog';
import { useDogUpdate } from '@/hooks/useDogUpdate'; // 새로운 훅 import

export default function DogsEditPage() {
  const router = useRouter();
  const params = useParams();
  const dogId = params?.dogId as string;

  // useDog 훅을 사용하여 강아지 데이터 조회
  const { dog, isLoading: isLoadingDog, error: dogError } = useDog(dogId);

  // useDogUpdate 훅 사용
  const { updateDogInfo, isUpdating, updateError } = useDogUpdate();

  // 강아지 정보 상태
  const [name, setName] = useState('');
  const [status, setStatus] = useState<DogStatus>(DogStatus.PROTECTED);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [breed, setBreed] = useState('');
  const [energetic, setEnergetic] = useState(1);
  const [familiarity, setFamiliarity] = useState(1);
  const [isNeutered, setIsNeutered] = useState(false);
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [admissionDate, setAdmissionDate] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  // 에러 상태
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 강아지 데이터를 상태에 반영
  useEffect(() => {
    if (dog) {
      setName(dog.name || '');
      setStatus(dog.status);
      setGender(dog.gender);
      setAge(dog.age?.toString() || '');
      setWeight(dog.weight?.toString() || '');
      setBreed(dog.breed || '');
      setEnergetic(dog.energetic || 1);
      setFamiliarity(dog.familiarity || 1);
      setIsNeutered(dog.isNeutered || false);
      setIsVaccinated(dog.isVaccination || false);

      if (dog.admissionDate) {
        setAdmissionDate(formatDateForInput(dog.admissionDate));
      }
    }
  }, [dog]);

  // updateError가 변경되면 에러 상태 업데이트
  useEffect(() => {
    if (updateError) {
      setErrors((prev) => ({ ...prev, general: updateError }));
    }
  }, [updateError]);

  // ISO 날짜 문자열을 input date 형식으로 변환
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // 라디오 버튼 클릭 핸들러를 생성하는 함수 (상태, 성별)
  const handleStatusChange = (value: number) => {
    setStatus(value as DogStatus);
  };

  const handleGenderChange = (value: number) => {
    setGender(value as Gender);
  };

  const handleBooleanOptionChange =
    (setter: (value: boolean) => void) => (value: string) => {
      setter(value === '완료');
    };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!age.trim()) {
      newErrors.age = '나이를 입력해주세요';
    } else if (isNaN(Number(age)) || Number(age) < 0) {
      newErrors.age = '유효한 나이를 입력해주세요';
    }

    if (!weight.trim()) {
      newErrors.weight = '체중을 입력해주세요';
    } else if (isNaN(Number(weight)) || Number(weight) < 0) {
      newErrors.weight = '유효한 체중을 입력해주세요';
    }

    if (!breed.trim()) {
      newErrors.breed = '품종을 입력해주세요';
    }

    if (!admissionDate) {
      newErrors.admissionDate = '입소일을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러 - 수정된 부분
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // 폼 데이터 준비
      const formData: DogUpdateDto = {
        name,
        status,
        gender,
        age: parseInt(age),
        weight: parseFloat(weight),
        breed,
        energetic,
        familiarity,
        isNeutered,
        isVaccination: isVaccinated,
        admissionDate: new Date(admissionDate).toISOString(),
      };

      // 훅을 사용하여 강아지 정보 업데이트
      await updateDogInfo(parseInt(dogId), formData);

      router.push(`/admin/dogs/${dogId}`);
    } catch (error) {
      console.error('강아지 정보 수정 실패:', error);
      // 에러는 이미 updateError에 설정되고 useEffect에서 처리됨
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    router.push(`/admin/dogs/${dogId}`);
  };

  // 상태와 성별 라디오 버튼 렌더링 함수
  const renderDogStatusOptions = () => {
    return (
      <div className={styles.buttonGroup}>
        <Button
          variant={status === DogStatus.PROTECTED ? 'primary' : 'outline'}
          size='sm'
          onClick={() => handleStatusChange(DogStatus.PROTECTED)}
          className={styles.optionButton}
          type='button'
        >
          보호 중
        </Button>
        <Button
          variant={status === DogStatus.TEMPORARY ? 'primary' : 'outline'}
          size='sm'
          onClick={() => handleStatusChange(DogStatus.TEMPORARY)}
          className={styles.optionButton}
          type='button'
        >
          임시 보호 중
        </Button>
        <Button
          variant={status === DogStatus.ADOPTED ? 'primary' : 'outline'}
          size='sm'
          onClick={() => handleStatusChange(DogStatus.ADOPTED)}
          className={styles.optionButton}
          type='button'
        >
          입양 완료
        </Button>
        <Button
          variant={status === DogStatus.DECEASED ? 'primary' : 'outline'}
          size='sm'
          onClick={() => handleStatusChange(DogStatus.DECEASED)}
          className={styles.optionButton}
          type='button'
        >
          사망
        </Button>
      </div>
    );
  };

  const renderGenderOptions = () => {
    return (
      <div className={styles.buttonGroup}>
        <Button
          variant={gender === Gender.MALE ? 'primary' : 'outline'}
          size='sm'
          onClick={() => handleGenderChange(Gender.MALE)}
          className={styles.optionButton}
          type='button'
        >
          남
        </Button>
        <Button
          variant={gender === Gender.FEMALE ? 'primary' : 'outline'}
          size='sm'
          onClick={() => handleGenderChange(Gender.FEMALE)}
          className={styles.optionButton}
          type='button'
        >
          여
        </Button>
      </div>
    );
  };

  // 불리언 옵션 버튼 (중성화 여부, 접종 여부) 렌더링 함수
  const renderBooleanOptions = (
    value: boolean,
    onChange: (value: string) => void
  ) => {
    return (
      <div className={styles.buttonGroup}>
        <Button
          variant={!value ? 'primary' : 'outline'}
          size='sm'
          onClick={() => onChange('미완')}
          className={styles.optionButton}
          type='button'
        >
          미완
        </Button>
        <Button
          variant={value ? 'primary' : 'outline'}
          size='sm'
          onClick={() => onChange('완료')}
          className={styles.optionButton}
          type='button'
        >
          완료
        </Button>
      </div>
    );
  };

  // 로딩 상태 표시
  if (isLoadingDog) {
    return (
      <div className={styles.dogsEditPage}>
        <div className={styles.adminCard}>
          <div className={styles.loading}>정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 강아지 조회 에러 표시
  if (dogError) {
    return (
      <div className={styles.dogsEditPage}>
        <div className={styles.adminCard}>
          <div className={styles.error}>
            {dogError}
            <Button
              variant='primary'
              onClick={() => router.push('/admin/dogs')}
            >
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dogsEditPage}>
      <div className={styles.adminCard}>
        <div className={styles.headerActions}>
          <h1 className={styles.pageTitle}>강아지 정보 수정</h1>
        </div>

        {errors.general && (
          <div className={styles.errorMessage}>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <div className={styles.imageSection}>
              {dog?.imageUrl && (
                <div className={styles.currentImages}>
                  <h3 className={styles.sectionTitle}>현재 이미지</h3>
                  <div className={styles.currentImagePreview}>
                    <Image
                      src={dog.imageUrl || '/images/dummy.jpeg'}
                      alt={dog.name || '강아지 이미지'}
                      width={300}
                      height={300}
                      className={styles.previewImage}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formFields}>
              {/* 폼 필드 부분 - 변경 없음 */}
              <Input
                title='이름'
                placeHolder='이름을 입력해주세요.'
                value={name}
                onChange={(e) => setName(e.target.value)}
                hasError={!!errors.name}
                errorMessage={errors.name}
              />

              <Input
                title='품종'
                placeHolder='품종을 입력해주세요.'
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                hasError={!!errors.breed}
                errorMessage={errors.breed}
              />

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>상태</label>
                {renderDogStatusOptions()}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>성별</label>
                {renderGenderOptions()}
              </div>

              <Input
                title='나이(연령)'
                placeHolder='나이를 입력해주세요.'
                type='number'
                value={age}
                onChange={(e) => setAge(e.target.value)}
                hasError={!!errors.age}
                errorMessage={errors.age}
              />

              <Input
                title='체중(kg)'
                placeHolder='체중을 입력해주세요.'
                type='number'
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                hasError={!!errors.weight}
                errorMessage={errors.weight}
              />

              <Input
                title='입소일'
                type='date'
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                hasError={!!errors.admissionDate}
                errorMessage={errors.admissionDate}
                placeHolder={''}
              />

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>친화력</label>
                <RatingScale
                  value={familiarity}
                  onChange={setFamiliarity}
                  maxRating={5}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>활발함</label>
                <RatingScale
                  value={energetic}
                  onChange={setEnergetic}
                  maxRating={5}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>중성화 여부</label>
                {renderBooleanOptions(
                  isNeutered,
                  handleBooleanOptionChange(setIsNeutered)
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>접종 여부</label>
                {renderBooleanOptions(
                  isVaccinated,
                  handleBooleanOptionChange(setIsVaccinated)
                )}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              variant='outline'
              onClick={handleCancel}
              type='button'
              disabled={isUpdating}
            >
              취소하기
            </Button>
            <Button variant='primary' type='submit' disabled={isUpdating}>
              {isUpdating ? '처리 중...' : '수정완료'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
