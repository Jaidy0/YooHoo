'use client';

import { useState } from 'react';
import TabMenu from '@/components/common/TabMenu/TabMenu';
import styles from './page.module.scss';

interface GroupDetailClientProps {
  groupId: string;
}

export default function GroupDetailClient({ groupId }: GroupDetailClientProps) {
  // 더미 데이터
  const groupDesc = `계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 나는 아무 걱정도 없이 가을 속의 별들을 다 헤일 듯합니다. 가을 속에 하나 둘 새겨지는 별을 이제 다 못 헤는 것은 쉬이 아닙니다.`;

  // 탭 메뉴 아이템
  const tabMenuItems = [
    { name: '소개', link: `/groups/${groupId}?tab=intro` },
    { name: '보호 중인 강아지', link: `/groups/${groupId}?tab=dogs` },
    { name: '후원금 운용 내역', link: `/groups/${groupId}?tab=funds` },
  ];

  // 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState(0);

  // 탭 클릭 핸들러
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTabClick = (item: any, index: number) => {
    setActiveTab(index);
  };

  return (
    <div className={styles.contentContainer}>
      {/* 탭 메뉴 */}
      <div className={styles.tabMenuWrapper}>
        <div className={styles.tabMenuInner}>
          <TabMenu
            menuItems={tabMenuItems}
            defaultActiveIndex={activeTab}
            onMenuItemClick={handleTabClick}
            fullWidth
          />
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 0 && (
          <div className={styles.introContent}>
            <p className={styles.fullDescription}>{groupDesc}</p>
          </div>
        )}
        {activeTab === 1 && (
          <div className={styles.dogsContent}>
            {/* 강아지 목록은 다음 단계에서 구현 */}
            <p>보호 중인 강아지 목록입니다.</p>
          </div>
        )}
        {activeTab === 2 && (
          <div className={styles.fundsContent}>
            {/* 후원금 운용 내역은 다음 단계에서 구현 */}
            <p>후원금 운용 내역입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
