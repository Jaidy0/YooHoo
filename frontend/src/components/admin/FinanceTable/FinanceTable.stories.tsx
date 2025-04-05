import type { Meta, StoryObj } from '@storybook/react';
import FinanceTable from './FinanceTable';

// 가상의 입금 데이터
const depositData = [
  {
    type: '후원',
    name: '김철수',
    amount: 30000,
    message: '함께 힘내요!',
    date: '2025-03-22',
  },
  {
    type: '후원',
    name: '이영희',
    amount: 50000,
    message: '좋은 일에 써주세요',
    date: '2025-03-21',
  },
  {
    type: '후원',
    name: '박지민',
    amount: 100000,
    message: '유기견들에게 도움이 되길 바랍니다',
    date: '2025-03-20',
  },
  {
    type: '후원',
    name: '최민지',
    amount: 20000,
    date: '2025-03-19',
  },
  {
    type: '후원',
    name: '정서연',
    amount: 150000,
    message: '모든 강아지들이 행복하길',
    date: '2025-03-15',
  },
  {
    type: '후원',
    name: '송태양',
    amount: 45000,
    message: '앞으로도 좋은 활동 응원합니다',
    date: '2025-03-10',
  },
  {
    type: '후원',
    name: '한지원',
    amount: 60000,
    message: '유기견 보호에 써주세요',
    date: '2025-03-08',
  },
  {
    type: '후원',
    name: '임수진',
    amount: 25000,
    date: '2025-03-05',
  },
  {
    type: '후원',
    name: '강민수',
    amount: 80000,
    message: '동물 친구들을 위해 사용해주세요',
    date: '2025-03-01',
  },
  {
    type: '후원',
    name: '윤하은',
    amount: 30000,
    message: '작은 정성이지만 도움이 되길',
    date: '2025-02-28',
  },
  {
    type: '후원',
    name: '오준호',
    amount: 50000,
    message: '좋은 곳에 사용해주세요',
    date: '2025-02-25',
  },
  {
    type: '후원',
    name: '배수연',
    amount: 100000,
    message: '유기견 보호를 위한 후원입니다',
    date: '2025-02-20',
  },
  {
    type: '후원',
    name: '조현우',
    amount: 40000,
    date: '2025-02-15',
  },
];

// 가상의 출금 데이터 - props 맞추기
const withdrawData = [
  {
    withdrawalId: 1,
    type: '출금',
    category: '후원금',
    content: '월 정기 후원',
    amount: 50000,
    date: '2025-03-20',

    transactionUniqueNo: 10001,
    file_id: '',
  },
  {
    withdrawalId: 2,
    type: '출금',
    category: '후원금',
    content: '일시 후원',
    amount: 100000,
    date: '2025-03-18',
    file_id: '',
    transactionUniqueNo: 10002,
  },
  {
    withdrawalId: 3,
    type: '출금',
    category: '기부금',
    content: '단체 기부',
    amount: 300000,
    date: '2025-03-15',
    file_id: '',
    transactionUniqueNo: 10003,
  },
  {
    withdrawalId: 4,
    type: '출금',
    category: '후원금',
    content: '월 정기 후원',
    amount: 30000,
    date: '2025-03-10',
    file_id: '',
    transactionUniqueNo: 10004,
  },
  {
    withdrawalId: 5,
    type: '출금',
    category: '기부금',
    content: '행사 수익금',
    amount: 450000,
    date: '2025-03-05',
    file_id: '',
    transactionUniqueNo: 10005,
  },
  {
    withdrawalId: 6,
    type: '출금',
    category: '후원금',
    content: '일시 후원',
    amount: 25000,
    date: '2025-03-01',
    file_id: '',
    transactionUniqueNo: 10006,
  },
  {
    withdrawalId: 7,
    type: '출금',
    category: '기부금',
    content: '바자회 수익금',
    amount: 560000,
    date: '2025-02-28',
    file_id: '',
    transactionUniqueNo: 10007,
  },
  {
    withdrawalId: 8,
    type: '출금',
    category: '후원금',
    content: '월 정기 후원',
    amount: 50000,
    date: '2025-02-25',
    file_id: '',
    transactionUniqueNo: 10008,
  },
  {
    withdrawalId: 9,
    type: '출금',
    category: '후원금',
    content: '일시 후원',
    amount: 75000,
    date: '2025-02-20',
    file_id: '',
    transactionUniqueNo: 10009,
  },
  {
    withdrawalId: 10,
    type: '출금',
    category: '기부금',
    content: '기업 후원',
    amount: 1000000,
    date: '2025-02-15',
    file_id: '',
    transactionUniqueNo: 10010,
  },
  {
    withdrawalId: 11,
    type: '출금',
    category: '후원금',
    content: '월 정기 후원',
    amount: 30000,
    date: '2025-02-10',
    file_id: '',
    transactionUniqueNo: 10011,
  },
  {
    withdrawalId: 12,
    type: '출금',
    category: '기부금',
    content: '개인 기부',
    amount: 200000,
    date: '2025-02-05',
    file_id: '',
    transactionUniqueNo: 10012,
  },
];

/**
 * 재정 데이터 테이블 컴포넌트
 *
 * 입금 내역과 출금 내역을 탭으로 구분하여 볼 수 있는 테이블입니다.
 * 재정 관리 페이지나 관리자 대시보드에서 사용됩니다.
 */
const meta = {
  title: 'Components/Admin/FinanceTable',
  component: FinanceTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    depositData: {
      description: '입금 내역 데이터 배열',
      control: 'object',
    },
    withdrawData: {
      description: '출금 내역 데이터 배열',
      control: 'object',
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
  },
} satisfies Meta<typeof FinanceTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 FinanceTable 사용 예시
 */
export const Default: Story = {
  args: {
    depositData,
    withdrawData,
  },
};

/**
 * 데이터가 적은 경우 (페이지네이션 없음)
 */
export const FewItems: Story = {
  args: {
    depositData: depositData.slice(0, 4),
    withdrawData: withdrawData.slice(0, 3),
  },
};

/**
 * 데이터가 없는 경우
 */
export const NoData: Story = {
  args: {
    depositData: [],
    withdrawData: [],
  },
};

/**
 * 입금 데이터만 있는 경우
 */
export const OnlyDeposit: Story = {
  args: {
    depositData,
    withdrawData: [],
  },
};

/**
 * 출금 데이터만 있는 경우
 */
export const OnlyWithdraw: Story = {
  args: {
    depositData: [],
    withdrawData,
  },
};
