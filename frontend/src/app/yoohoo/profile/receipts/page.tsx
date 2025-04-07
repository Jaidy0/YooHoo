'use client';

import { useState, useMemo } from 'react';
import styles from './page.module.scss';
import SectionBox from '@/components/common/SectionBox/SectionBox';
import MyHistoryCard from '@/components/common/Card/MyHistoryCard/MyHistoryCard';
import Button from '@/components/common/buttons/Button/Button';
import { useDonations } from '@/hooks/donations/useDonationHistory';

export default function DonationReceiptPage() {
  const { donations, isLoading, error } = useDonations();
  const [selectedShelter, setSelectedShelter] = useState<string>('전체');
  const [showHometaxMenu, setShowHometaxMenu] = useState(false);

  const shelterList = useMemo(() => {
    const shelters = Array.from(
      new Set(donations.map((donation) => donation.shelterName))
    );
    return ['전체', ...shelters];
  }, [donations]);

  const filteredDonations =
    selectedShelter === '전체'
      ? donations
      : donations.filter((d) => d.shelterName === selectedShelter);

  const handleRedirect = () => {
    window.open(
      'https://www.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index.xml',
      '_blank'
    );
  };

  return (
    <div className={styles.receiptContainer}>
      <SectionBox title='후원금 영수증 안내' className={styles.sectionBox}>
        <p className={styles.guideText}>
          홈택스에서 전자기부금영수증 발급이 가능합니다.
          <br />
          등록된 내역이 없을 경우 단체를 지정해 신청이 가능하며,
          <br />
          기부금 영수증 신청 / 출력 / 발급된 목록 조회가 모두 가능합니다.
        </p>
        <Button onClick={handleRedirect} size='md' width='100%'>
          홈택스 전자기부금영수증 바로가기
        </Button>

        <button
          onClick={() => setShowHometaxMenu((prev) => !prev)}
          className={styles.menuToggleBtn}
        >
          홈택스 메뉴 경로 보기
        </button>

        {showHometaxMenu && (
          <ul className={styles.hometaxMenuList}>
            <li>전자기부금영수증 &gt; (기부자용) 발급 신청 및 목록관리 &gt;</li>
            <li></li>
            <li>
              &gt; <strong>전자기부금영수증 발급 신청</strong>
            </li>
            <li>
              &gt;{' '}
              <strong>
                전자기부금영수증 발급 목록 관리(기부금영수증 출력)
              </strong>
            </li>
            <li>
              &gt; <strong>전자기부금영수증 발급 목록 관리(목록 조회)</strong>
            </li>
          </ul>
        )}
      </SectionBox>

      <SectionBox
        title='유후에서 후원한 내역'
        subtitle='단체별 필터로 쉽게 확인해보세요'
        className={styles.sectionBox}
      >
        <div className={styles.filterContainer}>
          {shelterList.map((shelter) => (
            <button
              key={shelter}
              onClick={() => setSelectedShelter(shelter)}
              className={
                selectedShelter === shelter
                  ? styles.activeFilter
                  : styles.filterBtn
              }
            >
              {shelter}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className={styles.message}>로딩 중...</p>
        ) : error ? (
          <p className={styles.message}>{error}</p>
        ) : filteredDonations.length === 0 ? (
          <p className={styles.message}>후원 단체 내역이 없습니다.</p>
        ) : (
          <div className={styles.historyList}>
            {filteredDonations.map((donation) => (
              <MyHistoryCard
                key={donation.donationId}
                badgeText={donation.dogName ? '강아지 후원' : '단체 후원'}
                subText={
                  donation.dogName
                    ? `${donation.shelterName}(${donation.dogName})`
                    : donation.shelterName
                }
                mainText={`${donation.donationAmount.toLocaleString()}원`}
                date={donation.donationDate.replace(/-/g, '.')}
                variant='history'
                style={{ width: '100%' }}
              />
            ))}
          </div>
        )}
      </SectionBox>
    </div>
  );
}
