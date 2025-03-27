'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';
import Input from '@/components/common/Input/Input';
import Button from '@/components/common/buttons/Button/Button';
import RatingScale from '@/components/common/RatingScale/RatingScale';
import { Dog, DogStatus, Gender, DogImage } from '@/types/dog';
import styles from './page.module.scss';

export default function DogsEditPage() {
  const router = useRouter();
  const params = useParams();
  const dogId = params.dogId as string;

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

  // 이미지 상태
  const [dogImages, setDogImages] = useState<DogImage[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 강아지 데이터 불러오기
  useEffect(() => {
    const fetchDogData = async () => {
      setIsLoading(true);

      try {
        // TODO: 실제 API 호출로 대체
        // const response = await fetch(`/api/dogs/${dogId}`);
        // if (!response.ok) throw new Error('강아지 정보를 불러오는데 실패했습니다.');
        // const dogResponse = await response.json();
        // const dog = dogResponse.data;

        // 목업 데이터
        const mockData: Dog = {
          dogId: parseInt(dogId),
          name: '멍멍이',
          age: 3,
          weight: 5.5,
          gender: Gender.MALE,
          breed: '믹스견',
          energetic: 3,
          familiarity: 4,
          isVaccination: true,
          isNeutered: true,
          status: DogStatus.PROTECTED,
          admissionDate: '2023-10-15T09:00:00.000+00:00',
          images: [
            {
              imageId: 1,
              dogId: parseInt(dogId),
              imageUrl: 'https://via.placeholder.com/300x300',
              isMain: true,
              uploadDate: '2023-10-15T09:00:00.000+00:00',
            },
          ],
        };

        // 데이터 설정
        setName(mockData.name);
        setStatus(mockData.status);
        setGender(mockData.gender);
        setAge(mockData.age.toString());
        setWeight(mockData.weight.toString());
        setBreed(mockData.breed);
        setEnergetic(mockData.energetic);
        setFamiliarity(mockData.familiarity);
        setIsNeutered(mockData.isNeutered);
        setIsVaccinated(mockData.isVaccination);
        setAdmissionDate(formatDateForInput(mockData.admissionDate));

        if (mockData.images) {
          setDogImages(mockData.images);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dog data:', err);
        setErrors({ general: '강아지 정보를 불러오는데 실패했습니다.' });
        setIsLoading(false);
      }
    };

    fetchDogData();
  }, [dogId]);

  // ISO 날짜 문자열을 input date 형식으로 변환
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // 메인 이미지 업로드 핸들러
  const handleMainImageUpload = (file: File | null) => {
    setMainImage(file);
    if (errors.mainImage) {
      const newErrors = { ...errors };
      delete newErrors.mainImage;
      setErrors(newErrors);
    }
  };

  // 이미지 업로드 에러 핸들러
  const handleImageError = (message: string) => {
    setErrors((prev) => ({ ...prev, mainImage: message }));
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
    }

    if (!weight.trim()) {
      newErrors.weight = '체중을 입력해주세요';
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

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // 폼 데이터 준비
      const formData = {
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

      // TODO: API 호출 또는 상태 관리 로직 추가
      console.log('Updated dog data:', formData);
      console.log('Main image:', mainImage);
      console.log('Additional images:', additionalImages);

      alert('강아지 정보가 수정되었습니다.');
      router.push(`/admin/dogs/${dogId}`);
    } catch (error) {
      console.error('Error updating dog data:', error);
      setErrors({ general: '강아지 정보 수정에 실패했습니다.' });
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
  if (isLoading) {
    return (
      <div className={styles.dogsEditPage}>
        <div className={styles.adminCard}>
          <div className={styles.loading}>정보를 불러오는 중...</div>
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
              <div className={styles.currentImages}>
                <h3 className={styles.sectionTitle}>현재 이미지</h3>
                <div className={styles.imageGrid}>
                  {dogImages.map((img) => (
                    <div
                      key={img.imageId}
                      className={`${styles.currentImage} ${img.isMain ? styles.mainImage : ''}`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={`강아지 이미지 ${img.imageId}`}
                      />
                      {img.isMain && (
                        <span className={styles.mainTag}>대표</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.imageUploadSection}>
                <h3 className={styles.sectionTitle}>새 대표 이미지 업로드</h3>
                <ImageUpload
                  value={mainImage}
                  onChange={handleMainImageUpload}
                  onError={handleImageError}
                  error={errors.mainImage}
                  uploadText='대표 이미지를 업로드해주세요'
                />

                {/* 추가 이미지 업로드 기능은 필요에 따라 구현 */}
              </div>
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
            <Button variant='outline' onClick={handleCancel} type='button'>
              취소하기
            </Button>
            <Button variant='primary' type='submit'>
              수정완료
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
