'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/buttons/Button/Button';
import RatingScale from '@/components/common/RatingScale/RatingScale';
import styles from './page.module.scss';

export default function DogsRegisterPage() {
  const router = useRouter();

  // 상태 관리
  const [dogImage, setDogImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('보호 중');
  const [gender, setGender] = useState('남');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [health, setHealth] = useState('');
  const [friendliness, setFriendliness] = useState(1);
  const [isNeutered, setIsNeutered] = useState('미완');
  const [isVaccinated, setIsVaccinated] = useState('미완');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 이미지 업로드 핸들러
  const handleImageUpload = (file: File | null) => {
    setDogImage(file);
    if (errors.dogImage) {
      const newErrors = { ...errors };
      delete newErrors.dogImage;
      setErrors(newErrors);
    }
  };

  // 이미지 업로드 에러 핸들러
  const handleImageError = (message: string) => {
    setErrors((prev) => ({ ...prev, dogImage: message }));
  };

  // 라디오 버튼 클릭 핸들러를 생성하는 함수
  const createRadioHandler =
    (stateSetter: (value: string) => void) => (value: string) => {
      stateSetter(value);
    };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!dogImage) {
      newErrors.dogImage = '강아지 사진을 업로드해주세요';
    }

    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!age.trim()) {
      newErrors.age = '나이를 입력해주세요';
    }

    if (!weight.trim()) {
      newErrors.weight = '체중을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // TODO: API 호출 또는 상태 관리 로직 추가
    console.log({
      dogImage,
      name,
      status,
      gender,
      age,
      weight,
      health,
      friendliness,
      isNeutered,
      isVaccinated,
    });

    alert('강아지 정보가 등록되었습니다.');
    router.push('/admin/dogs');
  };

  // 초기화 핸들러
  const handleReset = () => {
    setDogImage(null);
    setName('');
    setStatus('보호 중');
    setGender('남');
    setAge('');
    setWeight('');
    setHealth('');
    setFriendliness(1);
    setIsNeutered('미완');
    setIsVaccinated('미완');
    setErrors({});
  };

  // Button을 라디오 버튼처럼 사용하기 위한 렌더링 함수
  const renderOptionButtons = (
    options: string[],
    currentValue: string,
    name: string,
    onChange: (value: string) => void
  ) => {
    return options.map((option) => (
      <Button
        key={option}
        variant={currentValue === option ? 'primary' : 'outline'}
        size='sm'
        onClick={() => onChange(option)}
        className={styles.optionButton}
        type='button'
      >
        {option}
      </Button>
    ));
  };

  return (
    <div className={styles.dogsRegisterPage}>
      <div className={styles.adminCard}>
        <div className={styles.headerActions}>
          <h1 className={styles.pageTitle}>강아지 정보 관리</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <div className={styles.imageSection}>
              <ImageUpload
                value={dogImage}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                hasError={!!errors.name}
                errorMessage={errors.name}
              />

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>상태</label>
                <div className={styles.buttonGroup}>
                  {renderOptionButtons(
                    ['보호 중', '입양 완료', '사망', '임시 보호 중'],
                    status,
                    'status',
                    createRadioHandler(setStatus)
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>성별</label>
                <div className={styles.buttonGroup}>
                  {renderOptionButtons(
                    ['남', '여'],
                    gender,
                    'gender',
                    createRadioHandler(setGender)
                  )}
                </div>
              </div>

              <Input
                title='나이(연령)'
                placeHolder='나이를 입력해주세요.'
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
                title='건강'
                placeHolder='해당되는 건강을 입력해주세요.'
                value={health}
                onChange={(e) => setHealth(e.target.value)}
              />

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>친화력</label>
                <RatingScale
                  value={friendliness}
                  onChange={setFriendliness}
                  maxRating={5}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>중성화 여부</label>
                <div className={styles.buttonGroup}>
                  {renderOptionButtons(
                    ['미완', '완료'],
                    isNeutered,
                    'isNeutered',
                    createRadioHandler(setIsNeutered)
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.groupLabel}>접종 여부</label>
                <div className={styles.buttonGroup}>
                  {renderOptionButtons(
                    ['미완', '완료'],
                    isVaccinated,
                    'isVaccinated',
                    createRadioHandler(setIsVaccinated)
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button variant='outline' onClick={handleReset} type='button'>
              취소하기
            </Button>
            <Button variant='primary' type='submit'>
              등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
