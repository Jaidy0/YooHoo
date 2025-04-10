'use client';

import { useRouter, useParams } from 'next/navigation';
import RatingScale from '@/components/common/RatingScale/RatingScale';
import Image from 'next/image';
import Button from '@/components/common/buttons/Button/Button';
import styles from './page.module.scss';
import FinanceTable from '@/components/admin/FinanceTable/FinanceTable';

import { getStatusText, getGenderText } from '@/types/dog';
import { useDog } from '@/hooks/useDog'; // 강아지 정보 커스텀 훅
import { useDogFinance } from '@/hooks/useDogFinance'; // 강아지 재정 데이터 커스텀 훅

export default function DogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dogId = params?.dogId as string;

  // 커스텀 훅 사용
  const {
    dog: dogData,
    isLoading: isDogLoading,
    error: dogError,
  } = useDog(dogId);

  // 강아지 후원금 데이터 커스텀 훅 사용
  const {
    depositData,
    withdrawData,
    isLoading: isFinanceLoading,
    error: financeError,
  } = useDogFinance(dogId);

  // 편집 페이지로 이동
  const handleEdit = () => {
    router.push(`/admin/dogs/edit/${dogId}`);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    router.push('/admin/dogs');
  };

  // 날짜 포맷 변환
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 로딩 상태 표시
  const isLoading = isDogLoading || isFinanceLoading;
  if (isLoading) {
    return (
      <div className={styles.dogsDetailPage}>
        <div className={styles.adminCard}>
          <div className={styles.loading}>정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  const error = dogError || financeError;
  if (error || !dogData) {
    return (
      <div className={styles.dogsDetailPage}>
        <div className={styles.adminCard}>
          <div className={styles.error}>
            {error || '강아지 정보를 불러오는데 실패했습니다.'}
            <Button variant='primary' onClick={handleBackToList}>
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dogsDetailPage}>
      <section className={styles.adminCard}>
        <div className={styles.headerActions}>
          <h1 className={styles.pageTitle}>강아지 상세 정보</h1>
          <div className={styles.actionButtons}>
            <Button variant='outline' onClick={handleBackToList}>
              목록으로
            </Button>
            <Button variant='primary' onClick={handleEdit}>
              수정하기
            </Button>
          </div>
        </div>

        <div className={styles.formContent}>
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <Image
                src={dogData?.imageUrl || '/images/dummy.jpeg'}
                alt={dogData?.name || '강아지 이미지'}
                width={300}
                height={300}
                className={styles.dogImage}
              />
            </div>
          </div>

          <div className={styles.formFields}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>이름</span>
              <span className={styles.detailValue}>{dogData?.name}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>품종</span>
              <span className={styles.detailValue}>{dogData?.breed}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>상태</span>
              <span
                className={`${styles.detailValue} ${styles.statusBadge} ${styles[`status${dogData?.status}`]}`}
              >
                {getStatusText(dogData.status)}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>성별</span>
              <span className={styles.detailValue}>
                {getGenderText(dogData.gender)}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>나이</span>
              <span className={styles.detailValue}>{dogData?.age}세</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>체중</span>
              <span className={styles.detailValue}>{dogData?.weight}kg</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>입소일</span>
              <span className={styles.detailValue}>
                {dogData.admissionDate && formatDate(dogData.admissionDate)}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>친화력</span>
              <span className={styles.detailValue}>
                <RatingScale
                  value={dogData?.familiarity || 1}
                  onChange={() => {}} // 상세 페이지에서는 수정 불가능하므로 빈 함수
                  maxRating={5}
                  readOnly={true}
                />
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>활발함</span>
              <span className={styles.detailValue}>
                <RatingScale
                  value={dogData?.energetic || 1}
                  onChange={() => {}} // 상세 페이지에서는 수정 불가능하므로 빈 함수
                  maxRating={5}
                  readOnly={true}
                />
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>중성화 여부</span>
              <span className={styles.detailValue}>
                {dogData?.isNeutered ? '완료' : '미완'}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>접종 여부</span>
              <span className={styles.detailValue}>
                {dogData?.isVaccination ? '완료' : '미완'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>후원금 입출금 내역</h2>
        </div>

        {/* 실제 API에서 가져온 데이터로 FinanceTable 컴포넌트 사용 */}
        <FinanceTable
          depositData={depositData}
          withdrawData={withdrawData}
          className={styles.financeTable}
        />

        {/* 데이터가 없을 경우 메시지 표시 */}
        {depositData.length === 0 && withdrawData.length === 0 && (
          <div className={styles.noDataMessage}>입출금 내역이 없습니다.</div>
        )}
      </section>
    </div>
  );
}
