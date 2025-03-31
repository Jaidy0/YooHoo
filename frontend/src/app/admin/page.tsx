'use client';

import styles from './page.module.scss';
import Image from 'next/image';
import IconBox from '@/components/common/IconBox/IconBox';
import { useShelterData } from '@/hooks/useShetlerData';

export default function AdminPage() {
  // 임시 보호소 ID (향후 사용자 정보에서 가져올 예정)
  const shelterId = 1;

  // 커스텀 훅을 사용하여 보호소 데이터 가져오기
  const { shelter, isLoading, error, refreshData } = useShelterData(shelterId);

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
          <div className={styles.settingButton}>
            <IconBox name='gear'></IconBox>
          </div>
          <div className={styles.shelterInfoText}>
            {/* 설립연도 */}
            <div className={styles.shelterInfoItem}>
              <div className={styles.shelterSubtitle}>설립연도</div>
              <div className={styles.shelterInfoContent}>
                {displayData.foundationDate}
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
              <div className={styles.questionButton}>
                <IconBox name='zoom'></IconBox>
              </div>
            </div>
            {/* API에서 받아온 신뢰도 표시 (필요한 경우) */}
            {shelter && (
              <div className={styles.trustIndicator}>
                <div className={styles.trustBar}>
                  <div
                    className={styles.trustFill}
                    style={{ width: `${displayData.reliability}%` }}
                  ></div>
                </div>
                <div className={styles.trustPercentage}>
                  {displayData.reliability}%
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.adminFootPrint}>
          <div className={styles.footPrintContent}>
            <div className={styles.trustHeader}>
              <div className={styles.adminTitle}>단체 신뢰 지수</div>
            </div>
          </div>
        </div>
      </div>

      {/* 에러 메시지 표시 (개발 중에만 사용, 실제 배포 시 제거 또는 스타일 개선) */}
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={refreshData}>다시 시도</button>
        </div>
      )}

      {/* 로딩 인디케이터 (필요한 경우) */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <p>정보를 불러오는 중...</p>
        </div>
      )}
    </div>
  );
}
