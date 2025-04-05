import { useState } from 'react';
import styles from './FinanceTable.module.scss';
import DepositTableRow, { DepositTableRowProps } from './DepositTableRow';
import WithdrawTableRow, { WithdrawTableRowProps } from './WithdrawTableRow';
import Pagination from '@/components/common/Pagination/Pagination';
import TabMenu, { TabMenuItem } from '@/components/common/TabMenu/TabMenu';

export interface FinanceTableProps {
  depositData: Omit<DepositTableRowProps, 'variant'>[];
  withdrawData: Omit<WithdrawTableRowProps, 'variant' | 'onReceiptChange'>[];
  className?: string;
}

export default function FinanceTable({
  depositData,
  withdrawData,
  className,
}: FinanceTableProps) {
  // 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState<string>('deposit');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 탭 메뉴 아이템 정의
  const menuItems: TabMenuItem[] = [
    { name: '입금 내역', link: '#deposit', isActive: activeTab === 'deposit' },
    {
      name: '출금 내역',
      link: '#withdraw',
      isActive: activeTab === 'withdraw',
    },
  ];

  // 탭 클릭 핸들러
  const handleTabClick = (item: TabMenuItem, index: number) => {
    setActiveTab(index === 0 ? 'deposit' : 'withdraw');
    setCurrentPage(1); // 탭 변경 시 페이지 초기화
  };

  // 현재 활성화된 탭의 데이터 선택
  const activeData = activeTab === 'deposit' ? depositData : withdrawData;

  // 현재 페이지에 표시할 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeData.slice(indexOfFirstItem, indexOfLastItem);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(activeData.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 영수증 상태 변경 핸들러 함수 (출금 데이터를 위한 콜백)
  const handleReceiptChange = () => {
    // 필요한 경우 상태 업데이트 또는 부모 컴포넌트에 알림
    console.log('Receipt status changed');
    // 추가 로직이 필요한 경우 여기에 작성
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.tableHeader}>
        <div className={styles.smallTabMenuWrapper}>
          <TabMenu
            menuItems={menuItems}
            onMenuItemClick={handleTabClick}
            fullWidth={false}
            size='sm'
            className={styles.smallTabMenu}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {activeTab === 'deposit' ? (
          <>
            {/* 입금 테이블 헤더 */}
            <DepositTableRow
              variant='header'
              type=''
              name=''
              amount={0}
              date=''
              message=''
            />

            {/* 입금 테이블 데이터 행 */}
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <DepositTableRow
                  key={index}
                  {...(item as Omit<DepositTableRowProps, 'variant'>)}
                />
              ))
            ) : (
              <div className={styles.noData}>데이터가 없습니다</div>
            )}
          </>
        ) : (
          <>
            {/* 출금 테이블 헤더 */}
            <WithdrawTableRow
              variant='header'
              withdrawalId={0}
              type=''
              category=''
              content=''
              amount={0}
              date=''
              isReceipt={false}
              transactionUniqueNo={0}
            />

            {/* 출금 테이블 데이터 행 */}
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <WithdrawTableRow
                  key={index}
                  {...(item as Omit<WithdrawTableRowProps, 'variant'>)}
                  onReceiptChange={handleReceiptChange}
                />
              ))
            ) : (
              <div className={styles.noData}>데이터가 없습니다</div>
            )}
          </>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageRangeDisplayed={5}
          />
        </div>
      )}
    </div>
  );
}
