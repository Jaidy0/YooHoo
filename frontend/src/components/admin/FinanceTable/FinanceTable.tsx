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
  const [showInfoMessage, setShowInfoMessage] = useState(true);
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
    setShowInfoMessage(true); // 탭 변경 시 안내 메시지 다시 표시
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
  // 안내 메시지 닫기
  const handleCloseInfoMessage = () => {
    setShowInfoMessage(false);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.tableHeader}>
        <div className={styles.smallTabMenuWrapper}>
          <TabMenu
            menuItems={menuItems}
            onMenuItemClick={handleTabClick}
            fullWidth={false}
            size='lg'
            className={styles.smallTabMenu}
          />
        </div>
      </div>

      {/* 출금 탭이 활성화되었을 때만 인라인 메시지 표시 */}
      {activeTab === 'withdraw' && showInfoMessage && (
        <div className={styles.infoMessage}>
          <svg
            className={styles.infoIcon}
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle cx='8' cy='8' r='7' stroke='#7c514d' strokeWidth='1.5' />
            <path
              d='M8 5V11'
              stroke='#7c514d'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
            <circle cx='8' cy='3.5' r='0.5' fill='#7c514d' stroke='#7c514d' />
          </svg>
          <span>
            출금 내역의 <strong>구분</strong> 항목을 클릭하면 강아지 지정 출금
            내역으로 설정할 수 있습니다.
          </span>
          <button
            className={styles.closeButton}
            onClick={handleCloseInfoMessage}
            aria-label='안내 메시지 닫기'
          >
            <svg
              width='10'
              height='10'
              viewBox='0 0 10 10'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1 1L9 9M9 1L1 9'
                stroke='#777777'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
      )}

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
              file_id=''
              transactionUniqueNo={0}
            />

            {/* 출금 테이블 데이터 행 */}
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <WithdrawTableRow
                  key={index}
                  {...(item as Omit<WithdrawTableRowProps, 'variant'>)}
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
