'use client';

import { useState, useEffect } from 'react';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import DogCard from '@/components/common/Card/DogCard/DogCard';
import DogDetailView from '@/components/shelters/DogDetailView/DogDetailView';
import { Dog } from '@/types/dog';
import styles from './page.module.scss';
import Button from '@/components/common/buttons/Button/Button';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useShelterData } from '@/hooks/useShetlerData';
import { useInfiniteDogData } from '@/hooks/useInfiniteDogData';
import { useDog } from '@/hooks/useDog';
import DonationUsageChart from '@/components/shelters/DonationUsageChart/DonationUsageChart';
import ReliabilityChart from '@/components/shelters/ReliabilityChart/ReliabilityChart';
import DonationUseHistoryList from '@/components/shelters/DonationUseHistoryList/DonationUseHistoryList';
import EvidanceModal from '@/components/admin/EvidenceModal/EvidanceModal';
import { useShelterWithdrawals } from '@/hooks/useShelterWithdrawals';
import { useShelterTotalAmountResult } from '@/hooks/useShelterTotalAmountResult';
import ReceiptModal from '@/components/admin/ReceiptModal/ReceiptModal';
import { useCategoryPercentages } from '@/hooks/useCategoryPercentages';
import { useSearchParams } from 'next/navigation';
import TrustTooltip from '@/components/common/TrustTooltip/TrustTooltip';

interface GroupDetailClientProps {
  groupId: string;
}

export default function GroupDetailClient({ groupId }: GroupDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 tab과 dogId 가져오기
  const tabParam = searchParams?.get('tab');
  const dogIdParam = searchParams?.get('dogId');

  // 상태 관리
  const [activeTab, setActiveTab] = useState(tabParam ? parseInt(tabParam) : 0);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<number | null>(
    dogIdParam ? parseInt(dogIdParam) : null
  );
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<{
    uniqueNo: number;
    type: boolean;
    withdrawId?: number;
  } | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다
  const day = currentDate.getDate();

  // useShelterData 훅 사용
  const {
    shelter,
    isLoading: isShelterLoading,
    error: shelterError,
    refreshData: refreshShelterData,
  } = useShelterData(Number(groupId));

  // useInfiniteDogData 훅 사용
  const {
    dogs,
    isLoading: isDogLoading,
    error: dogError,
    hasMore,
    loadMore,
  } = useInfiniteDogData({
    shelterId: Number(groupId),
    pageSize: 6,
    initialStatus: 'all',
    initialSearch: '',
  });

  const {
    totalIncome,
    totalExpense,
    // isLoading: isAmountLoading,
    // error: amountError,
  } = useShelterTotalAmountResult(Number(groupId));

  // 선택된 강아지의 상세 정보를 가져오기 위한 useDog 훅
  const { dog: dogDetails, isLoading: isDogDetailsLoading } = useDog(
    selectedDogId || 0
  );

  // 카테고리 퍼센티지 데이터 가져오기
  const {
    categories: categoryPercentages,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useCategoryPercentages(Number(groupId));

  // 탭 메뉴 아이템
  const tabMenuItems = [
    { name: '소개' },
    { name: '보호 중인 강아지' },
    { name: '후원금 운용 내역' },
  ];

  // TabMenuItem 인터페이스 정의
  interface TabMenuItem {
    name: string;
    link?: string;
    isActive?: boolean;
  }

  // 탭 클릭 핸들러
  function handleTabClick(item: TabMenuItem, index: number) {
    setActiveTab(index);
    setSelectedDog(null); // 탭 변경시 선택된 강아지 초기화
  }

  // 강아지 카드 클릭 핸들러
  function handleDogClick(dogId: number) {
    const dog = dogs.find((dog) => dog.dogId === dogId);

    if (dog) {
      setSelectedDog(dog);
      setSelectedDogId(dogId);
    }
  }

  // 컴포넌트 마운트 시 URL 파라미터에 따라 상태 설정
  useEffect(() => {
    if (tabParam) {
      setActiveTab(parseInt(tabParam));
    }

    if (dogIdParam) {
      const dogId = parseInt(dogIdParam);
      setSelectedDogId(dogId);

      // 강아지 데이터가 로드된 후에 해당 강아지 선택
      if (!isDogLoading && dogs.length > 0) {
        const dog = dogs.find((d) => d.dogId === dogId);
        if (dog) {
          setSelectedDog(dog);
        }
      }
    }
  }, [tabParam, dogIdParam, isDogLoading, dogs]);

  // 상세 정보 닫기 핸들러
  function handleCloseDetail() {
    setSelectedDog(null);
    setSelectedDogId(null);
  }

  // 더보기 버튼 클릭 핸들러
  function handleLoadMore() {
    loadMore();
  }

  // 단체 후원하기 버튼 클릭 핸들러
  function handleShelterDonation() {
    router.push(`/yoohoo/donate?shelterId=${groupId}`);
  }

  // 강아지 지정 후원하기 버튼 클릭 핸들러
  function handleDogDonation() {
    if (selectedDog) {
      router.push(
        `/yoohoo/donate?shelterId=${groupId}&dogId=${selectedDog.dogId}`
      );
    }
  }

  // 증빙자료 클릭 핸들러
  const handleEvidenceClick = (transactionUniqueNo: number, type: boolean) => {
    const newTransaction = { uniqueNo: transactionUniqueNo, type };
    setSelectedTransaction(newTransaction);
    setIsEvidenceModalOpen(true);
    console.log('***!!! selectedTransaction : ', newTransaction);
  };

  // 영수증 확인 클릭 핸들러
  const handleReceiptClick = (withdrawId: number) => {
    setSelectedTransaction({ uniqueNo: 0, type: false, withdrawId });
    setIsReceiptModalOpen(true);
  };

  // Modal 닫기 핸들러들
  const handleCloseEvidenceModal = () => {
    setIsEvidenceModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedTransaction(null);
  };

  // 지출 내역 데이터 가져오기
  const {
    withdrawals,
    isLoading: isWithdrawalsLoading,
    error: withdrawalsError,
  } = useShelterWithdrawals(Number(groupId));

  // 지출 내역 데이터 변환
  const formatDate = (dateString: string): string => {
    if (!dateString) return '날짜 없음';
    try {
      // YYYYMMDD 형식을 YYYY.MM.DD 형식으로 변환
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${year}.${month}.${day}`;
    } catch (error) {
      console.error('날짜 변환 오류:', error);
      return '날짜 형식 오류';
    }
  };

  const historyItems = withdrawals.map((withdrawal) => {
    // console.log('withdrawal category:', withdrawal.category);
    // console.log('전체 withdrawal 객체:', withdrawal);

    return {
      date: formatDate(withdrawal.date),
      withdrawalId: withdrawal.withdrawalId,
      transactionUniqueNo: withdrawal.transactionUniqueNo,
      merchantId: withdrawal.merchantId,
      name: withdrawal.name,
      transactionBalance: withdrawal.transactionBalance,
      shelterId: withdrawal.shelterId,
      category: withdrawal.category || '미분류', // 기본값 추가
      content: withdrawal.content,
      amount: withdrawal.amount,
      withdrawalDate: withdrawal.withdrawalDate,
      file_id: withdrawal.file_id,
      dogId: withdrawal.dogId,
      dogName: withdrawal.dogName,
      type: withdrawal.type,
      onEvidenceClick: handleEvidenceClick,
      onReceiptClick: handleReceiptClick,
    };
  });

  const toggleTooltip = () => setIsTooltipOpen((prev) => !prev);

  // 로딩 상태 체크 수정
  if (
    isShelterLoading ||
    isDogLoading ||
    isWithdrawalsLoading ||
    isCategoryLoading
  ) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 상태 체크 수정
  if (shelterError || dogError || withdrawalsError || categoryError) {
    return (
      <div className={styles.errorContainer}>
        <p>
          {(
            shelterError ||
            dogError ||
            withdrawalsError ||
            categoryError
          )?.toString() || '데이터를 불러오는 중 오류가 발생했습니다.'}
        </p>
        <Button
          onClick={() => {
            if (shelterError) refreshShelterData();
          }}
        >
          다시 시도하기
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.buttonWrapper}>
        <Button className={styles.yellowButton} onClick={handleShelterDonation}>
          이 단체 후원하기
        </Button>
      </div>

      {/* 탭 메뉴 */}
      <div className={styles.tabMenuWrapper}>
        <div className={styles.tabMenuInner}>
          <TabMenu
            size='sm'
            menuItems={tabMenuItems}
            defaultActiveIndex={activeTab}
            onMenuItemClick={handleTabClick}
            fullWidth={true}
          />
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 0 && (
          <div className={styles.introContent}>
            <h3 className={styles.sectionTitle}>단체 소개</h3>
            <p className={styles.fullDescription}>{shelter?.content}</p>

            <div className={styles.shelterDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>설립연도</span>
                <span className={styles.detailValue}>
                  {shelter?.foundationDate?.split('-')[0] || '정보 없음'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>주소</span>
                <span className={styles.detailValue}>{shelter?.address}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>이메일</span>
                <span className={styles.detailValue}>{shelter?.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>전화번호</span>
                <span className={styles.detailValue}>{shelter?.phone}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>사업자등록번호</span>
                <span className={styles.detailValue}>
                  {shelter?.businessNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && !selectedDog && (
          <div className={styles.dogsContent}>
            <div className={styles.dogsGrid}>
              {dogs.map((dog) => (
                <div key={dog.dogId} className={styles.dogCardWrapper}>
                  <DogCard
                    dog={dog}
                    onClick={() => handleDogClick(dog.dogId)}
                    disableRouting={true}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <Button
                  width='100%'
                  className={styles.moreBtn}
                  onClick={handleLoadMore}
                >
                  + 더보기
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && selectedDog && (
          <div className={styles.details}>
            {isDogDetailsLoading ? (
              <div className={styles.loadingContainer}>
                <LoadingSpinner />
              </div>
            ) : dogDetails ? (
              <>
                <DogDetailView
                  selectedDog={selectedDog}
                  dogDetails={dogDetails}
                  onClose={handleCloseDetail}
                />
                <Button
                  width='100%'
                  className={styles.yellowButton}
                  onClick={handleDogDonation}
                >
                  이 강아지 지정 후원하기
                </Button>
              </>
            ) : (
              <div className={styles.errorContainer}>
                <p>강아지 정보를 불러오는데 실패했습니다.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className={styles.fundsContent}>
            <h2 className={styles.sectionTitle}>후원금 운용 내역</h2>
            <h3 className={styles.sectionSubTitle}>
              신뢰 지수
              <TrustTooltip isOpen={isTooltipOpen} onToggle={toggleTooltip} />
            </h3>
            <ReliabilityChart
              reliability={shelter?.reliability || 0}
              dogScore={shelter?.dogScore || 0}
              foundationScore={shelter?.foundationScore || 0}
              fileScore={shelter?.fileScore || 0}
            />
            <h3 className={styles.sectionSubTitle}>후원금 운용내역 보고</h3>
            <DonationUsageChart
              categories={categoryPercentages}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              year={year}
              month={month}
              day={day}
            />
            <h3 className={styles.sectionSubTitle}>단체 지출 내역</h3>
            <DonationUseHistoryList histories={historyItems} />
          </div>
        )}
      </div>

      {/* Modal 컴포넌트 추가 */}
      {selectedTransaction && (
        <>
          <EvidanceModal
            className={styles.evidenceModal}
            isOpen={isEvidenceModalOpen}
            onClose={handleCloseEvidenceModal}
            transactionUniqueNo={selectedTransaction.uniqueNo}
            type={selectedTransaction.type}
            shelterId={Number(groupId)}
          />
          <ReceiptModal
            className={styles.ReceiptModal}
            isOpen={isReceiptModalOpen}
            onClose={handleCloseReceiptModal}
            withdrawId={selectedTransaction.withdrawId || 0}
          />
        </>
      )}
    </div>
  );
}
