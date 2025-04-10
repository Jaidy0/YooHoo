'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dog, Gender, DogStatus } from '@/types/dog';
import styles from './DogDetailView.module.scss';
import RoundButton from '@/components/common/buttons/RoundButton/RoundButton';
import IconBox from '@/components/common/IconBox/IconBox';
import DonationHistoryItem from '@/components/donations/DonationHistoryItem/DonationHistoryItem';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import {
  FormattedDepositItem,
  FormattedWithdrawalItem,
} from '@/types/adminDonation';
import { useDogFinance } from '@/hooks/useDogFinance';
import RatingScale from '@/components/common/RatingScale/RatingScale';
import DogExpenseHistoryItem from '../DogExpenseHistoryItem/DogExpenseHistoryItem';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';
import Button from '@/components/common/buttons/Button/Button';
// import { useDog } from '@/hooks/useDog';

interface DogDetailViewProps {
  selectedDog: Dog;
  dogDetails: Dog;
  onClose: () => void;
}

export default function DogDetailView({
  selectedDog,
  dogDetails,
  onClose,
}: DogDetailViewProps) {
  console.log('Dog Detail View First : ', dogDetails);
  // const {
  //   dog: dogData,
  //   isLoading: isDogLoading,
  //   error: dogError,
  // } = useDog(String(dogDetails.dogId));

  // 후원 내역 데이터 가져오기
  const { depositData, withdrawData, isLoading, error } = useDogFinance(
    String(dogDetails.dogId)
    // String(306)
  );
  console.log('### dogDetails : ', dogDetails);
  console.log('******************depositData************** : ', depositData);

  const [activeTab, setActiveTab] = useState<'donation' | 'expense'>(
    'donation'
  );
  const [visibleDonationCount, setVisibleDonationCount] = useState(3);
  const [visibleExpenseCount, setVisibleExpenseCount] = useState(3);

  // 총 후원금액 계산
  const totalDonation = depositData.reduce((sum, item) => sum + item.amount, 0);
  const formattedTotalDonation = `${totalDonation.toLocaleString()}원`;

  // admissionDate가 존재할 때만 날짜 포맷팅을 처리
  const formattedAdmissionDate = dogDetails.admissionDate
    ? new Date(dogDetails.admissionDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '날짜 정보 없음';

  const tabMenuItems: TabMenuItem[] = [
    { name: '후원 내역', link: '#donation' },
    { name: '지출 내역', link: '#expense' },
  ];

  const handleTabClick = (item: TabMenuItem, index: number) => {
    setActiveTab(index === 0 ? 'donation' : 'expense');
  };

  // 날짜 최신순으로 정렬된 후원 내역
  const sortedDepositData = [...depositData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 날짜 최신순으로 정렬된 지출 내역
  const sortedWithdrawData = [...withdrawData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleLoadMore = () => {
    if (activeTab === 'donation') {
      setVisibleDonationCount((prevCount) => prevCount + 3);
    } else {
      setVisibleExpenseCount((prevCount) => prevCount + 3);
    }
  };

  return (
    <div className={styles.dogDetailView}>
      <div className={styles.backButtonContainer}>
        <RoundButton onClick={onClose} className={styles.backButton}>
          <IconBox name='arrow' size={16}></IconBox>목록으로 돌아가기
        </RoundButton>
      </div>

      <div className={styles.dogDetailContainer}>
        <div className={styles.dogDetailHeader}>
          <div className={styles.dogImageContainer}>
            <Image
              src={selectedDog.imageUrl ?? '/images/dummy.jpeg'}
              alt={selectedDog.name}
              className={styles.dogDetailImage}
              width={400}
              height={400}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className={styles.dogInfoContainer}>
            <h2 className={styles.dogName}>{selectedDog.name}</h2>
            <div className={styles.dogBasicInfo}>
              <p>
                <span className={styles.infoLabel}>나이:</span> {dogDetails.age}
                살
              </p>
              <p>
                <span className={styles.infoLabel}>성별:</span>{' '}
                {dogDetails.gender === Gender.MALE ? '남아' : '여아'}
              </p>
              <p>
                <span className={styles.infoLabel}>품종:</span>{' '}
                {dogDetails.breed}
              </p>
              <p>
                <span className={styles.infoLabel}>체중:</span>{' '}
                {dogDetails.weight}kg
              </p>
              <p>
                <span className={styles.infoLabel}>중성화:</span>{' '}
                {dogDetails.isNeutered ? '완료' : '미완료'}
              </p>
              <p>
                <span className={styles.infoLabel}>예방접종:</span>{' '}
                {dogDetails.isVaccination ? '완료' : '미완료'}
              </p>
              <p>
                <span className={styles.infoLabel}>보호 상태:</span>{' '}
                {dogDetails.status === DogStatus.PROTECTED
                  ? '보호 중'
                  : dogDetails.status === DogStatus.ADOPTED
                    ? '입양 완료'
                    : dogDetails.status === DogStatus.TEMPORARY
                      ? '임시 보호 중'
                      : '사망'}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.dogDetailContent}>
          <section className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>소개</h3>
            <p className={styles.sectionContent}>
              {dogDetails.name}는 {dogDetails.breed} 품종으로, {dogDetails.age}
              살 {dogDetails.gender === Gender.MALE ? '남아' : '여아'}입니다.
              {formattedAdmissionDate}
              부터 저희 보호소에서 보호 중입니다.
            </p>
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>성격</h3>
            <div className={styles.personalityContainer}>
              <div className={styles.personalityItem}>
                <span
                  className={`${styles.personalityLabel} global-rating-label`}
                >
                  활발함
                </span>
                <span className={styles.detailValue}>
                  <RatingScale
                    value={dogDetails?.energetic || 1}
                    onChange={() => {}} // 상세 페이지에서는 수정 불가능하므로 빈 함수
                    maxRating={5}
                    readOnly={true}
                  />
                </span>
                {/* <div className={styles.personalityBar}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`${styles.personalityLevel} ${level <= (dogDetails.energetic ?? 0) ? styles.active : ''}`}
                    />
                  ))}
                </div> */}
              </div>
              <div className={styles.personalityItem}>
                <span className={styles.personalityLabel}>친화력</span>
                <span className={styles.detailValue}>
                  <RatingScale
                    value={dogDetails?.familiarity || 1}
                    onChange={() => {}} // 상세 페이지에서는 수정 불가능하므로 빈 함수
                    maxRating={5}
                    readOnly={true}
                  />
                </span>
              </div>
            </div>
            <ul className={styles.tagList}>
              {(dogDetails.energetic ?? 0) >= 4 && (
                <li className={styles.tag}>활발함</li>
              )}
              {(dogDetails.energetic ?? 0) <= 2 && (
                <li className={styles.tag}>조용함</li>
              )}
              {(dogDetails.familiarity ?? 0) >= 4 && (
                <li className={styles.tag}>사교적</li>
              )}
              {(dogDetails.familiarity ?? 0) <= 2 && (
                <li className={styles.tag}>독립적</li>
              )}
              <li className={styles.tag}>
                {dogDetails.isNeutered ? '중성화 완료' : '중성화 필요'}
              </li>
            </ul>
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>건강 상태</h3>
            <ul className={styles.medicalList}>
              <li>예방접종: {dogDetails.isVaccination ? '완료' : '미완료'}</li>
              <li>중성화: {dogDetails.isNeutered ? '완료' : '미완료'}</li>
              <li>정기 건강검진: 진행 중</li>
            </ul>
          </section>
          <section className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>모금 현황</h3>
            <div className={styles.donationStatus}>
              <div className={styles.donationAmount}>
                <span className={styles.donationLabel}>현재 모금액</span>
                <span className={styles.currentAmount}>
                  {formattedTotalDonation}
                </span>
              </div>

              <TabMenu
                className={styles.tabMenu}
                menuItems={tabMenuItems}
                onMenuItemClick={handleTabClick}
                activeIndex={activeTab === 'donation' ? 0 : 1}
                fullWidth={true}
              />

              <div className={styles.donationHistory}>
                {isLoading ? (
                  <div className={styles.loadingContainer}>
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className={styles.errorMessage}>{error}</div>
                ) : activeTab === 'donation' ? (
                  sortedDepositData.length === 0 ? (
                    <div className={styles.emptyMessage}>
                      아직 후원 내역이 없어요.
                    </div>
                  ) : (
                    <>
                      {sortedDepositData
                        .slice(0, visibleDonationCount)
                        .map(
                          (donation: FormattedDepositItem, index: number) => (
                            <DonationHistoryItem
                              key={index}
                              date={donation.date}
                              donorName={donation.depositorName}
                              amount={`${donation.amount.toLocaleString()}원`}
                              message={donation.message}
                            />
                          )
                        )}
                      {visibleDonationCount < sortedDepositData.length && (
                        <Button
                          onClick={handleLoadMore}
                          className={styles.loadMoreButton}
                        >
                          더보기
                        </Button>
                      )}
                    </>
                  )
                ) : sortedWithdrawData.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    아직 지출 내역이 없어요.
                  </div>
                ) : (
                  <>
                    {sortedWithdrawData
                      .slice(0, visibleExpenseCount)
                      .map(
                        (expense: FormattedWithdrawalItem, index: number) => (
                          <DogExpenseHistoryItem
                            key={index}
                            date={expense.date}
                            category={expense.category}
                            content={expense.content}
                            amount={`${expense.amount.toLocaleString()}원`}
                          />
                        )
                      )}
                    {visibleExpenseCount < sortedWithdrawData.length && (
                      <Button
                        onClick={handleLoadMore}
                        className={styles.loadMoreButton}
                      >
                        더보기
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
