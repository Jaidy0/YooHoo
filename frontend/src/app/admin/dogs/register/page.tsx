'use client';

import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/buttons/Button/Button';
import RatingScale from '@/components/common/RatingScale/RatingScale';
import styles from './page.module.scss';
import { useDogRegister } from '@/hooks/useDogRegister';
import { FormEvent } from 'react';

interface DogsRegisterPageProps {
  shelterId?: number;
}
export default function DogsRegisterPage({
  shelterId: propShelterId,
}: DogsRegisterPageProps) {
  const router = useRouter();
  const shelterId = propShelterId || 1;
  const {
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
  } = useDogRegister();

  // 폼 제출 핸들러
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await handleSubmit(shelterId);

    if (success) {
      alert('강아지 정보가 성공적으로 등록되었습니다.');
      // router.push('/admin/dogs/success');
    } else {
      alert('강아지 정보 등록에 실패했습니다. 다시 시도해주세요.');
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
                    ['보호 중', '입양 완료', '사망', '임시 보호 중'],
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

              <Input
                title='건강'
                placeHolder='해당되는 건강을 입력해주세요.'
                value={formState.health}
                onChange={(e) => handleInputChange('health', e.target.value)}
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
              disabled={isSubmitting}
            >
              취소하기
            </Button>
            <Button variant='primary' type='submit' disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : '등록하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
