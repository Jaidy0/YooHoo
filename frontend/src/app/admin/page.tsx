'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useShelterData } from '@/hooks/useShetlerData';
import { useAuthStore } from '@/store/authStore';
import ReliabilityChart from '@/components/shelters/ReliabilityChart/ReliabilityChart';

export default function AdminPage() {
  const router = useRouter();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const shelterId = user?.shelterId || 5;

  // 커스텀 훅을 사용하여 보호소 데이터 가져오기
  const { shelter, isLoading, error, refreshData, dogCount } =
    useShelterData(shelterId);

  const { shelter: shelterReliablity } = useShelterData(shelterId);

  // 툴팁 토글 및 닫기 함수
  const toggleTooltip = () => setIsTooltipOpen((prev) => !prev);
  const closeTooltip = () => setIsTooltipOpen(false);

  // 외부 클릭 시 툴팁 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        closeTooltip();
      }
    };

    if (isTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipOpen]);

  // 실제 표시할 데이터 (API에서 불러오거나 로딩 중이면 더미 데이터 사용)
  const displayData = {
    name: shelter?.name || '로딩 중',
    imageUrl: shelter?.imageUrl || '/images/dummy.jpeg',
    foundationDate: shelter?.foundationDate
      ? new Date(shelter.foundationDate).getFullYear().toString()
      : '로딩 중',
    address: shelter?.address || '로딩 중',
    businessNumber: shelter?.businessNumber || '로딩 중',
    phone: shelter?.phone || '로딩 중',
    email: shelter?.email || '로딩 중',
    content: shelter?.content || '로딩 중',
    reliability: shelter?.reliability || 0,
  };

  return (
    <div className={styles.adminShelter}>
      {/* 보호소 기본 정보 섹션 */}
      <div className={styles.adminShelterInfo}>
        <div className={styles.shelterPhoto}>
          <Image
            src={displayData.imageUrl}
            alt='보호소 사진'
            width={345}
            height={345}
            className={styles.shelterImage}
            priority
          />
        </div>
        <div className={styles.shelterText}>
          <div className={styles.shelterTitle}>{displayData.name}</div>
          {/* <div className={styles.settingButton}>
            <IconBox name='gear' size={24}></IconBox>
          </div> */}
          <div className={styles.shelterInfoText}>
            {/* 설립연도 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>설립연도</div>
              <div className={styles.shelterInfoContent}>
                {displayData.foundationDate}년
              </div>
            </div>

            {/* 주소 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>주소</div>
              <div className={styles.shelterInfoContent}>
                {displayData.address}
              </div>
            </div>

            {/* 사업자등록번호 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>사업자등록번호</div>
              <div className={styles.shelterInfoContent}>
                {displayData.businessNumber}
              </div>
            </div>

            {/* 전화번호 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>전화번호</div>
              <div className={styles.shelterInfoContent}>
                {displayData.phone}
              </div>
            </div>

            {/* 이메일 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>이메일</div>
              <div className={styles.shelterInfoContent}>
                {displayData.email}
              </div>
            </div>

            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>단체 소개</div>
              <div className={styles.shelterInfoContent}>
                {displayData.content}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.adminShelterDetail}>
        <div className={styles.adminTrust}>
          <div className={styles.trustContent}>
            <div className={styles.trustHeader}>
              <div className={styles.adminTitle}>단체 신뢰 지수</div>
              <div className={styles.questionButton} onClick={toggleTooltip}>
                ?
              </div>
              <div className={styles.tooltipContainer}>
                {isTooltipOpen && (
                  <div className={styles.tooltip} ref={tooltipRef}>
                    <h4>신뢰 지수란?</h4>
                    <p>
                      단체 신뢰 지수는 보호소의 투명성과 신뢰성을 나타내는
                      지표입니다.
                    </p>

                    <h4>🔍 신뢰 지수는 이렇게 계산해요!</h4>
                    <ul>
                      <li>1. 후원금 중 강아지 관련 지출 비율</li>
                      <li>2. 출금 내역에 활동 자료가 첨부된 비율</li>
                      <li>3. 설립 후 운영된 연수</li>
                    </ul>

                    <p>
                      총 100점 만점 기준으로 산정되며, 실시간으로 갱신됩니다
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* API에서 받아온 신뢰도 표시 */}

            {shelter && (
              <ReliabilityChart
                reliability={shelterReliablity?.reliability || 0}
                dogScore={shelterReliablity?.dogScore || 0}
                fileScore={shelterReliablity?.fileScore || 0}
                foundationScore={shelterReliablity?.foundationScore || 0}
              />
            )}
          </div>
        </div>

        <div className={styles.adminFootPrint}>
          <div className={styles.footPrintHeader}>
            <div className={styles.adminTitle}>우리의 발자취</div>
            <button
              className={styles.dogManageBtn}
              onClick={() => router.push('/admin/dogs')}
            >
              강아지 관리
            </button>
          </div>
          <div className={styles.footprintBox}>
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <div className={styles.pawContainer}>
                  <Image
                    src='/images/dogpaw.png'
                    alt='강아지 발바닥'
                    width={120}
                    height={120}
                    className={styles.pawImage}
                  />
                  <span className={styles.count}>{dogCount.rescue}</span>
                </div>
                <p className={styles.label}>구조된 강아지</p>
              </div>

              <div className={styles.statItem}>
                <div className={styles.pawContainer}>
                  <Image
                    src='/images/dogpaw.png'
                    alt='강아지 발바닥'
                    width={120}
                    height={120}
                    className={styles.pawImage}
                  />
                  <span className={styles.count}>{dogCount.protection}</span>
                </div>
                <p className={styles.label}>보호 중</p>
              </div>

              <div className={styles.statItem}>
                <div className={styles.pawContainer}>
                  <Image
                    src='/images/dogpaw.png'
                    alt='강아지 발바닥'
                    width={200}
                    height={120}
                    className={styles.pawImage}
                  />
                  <span className={styles.count}>{dogCount.adoption}</span>
                </div>
                <p className={styles.label}>입양 완료</p>
              </div>

              <div className={styles.dogImageContainer}></div>
            </div>
            <div className={styles.pawprintBackground}></div>
          </div>
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={refreshData}>다시 시도</button>
        </div>
      )}

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <p>정보를 불러오는 중...</p>
        </div>
      )}
    </div>
  );
}
