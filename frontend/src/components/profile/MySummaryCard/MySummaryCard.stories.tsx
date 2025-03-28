import type { Meta, StoryObj } from '@storybook/react';
import MySummaryCard from './MySummaryCard';

/**
 * 마이페이지 후원 데이터 요약 컴포넌트
 */
const meta: Meta<typeof MySummaryCard> = {
  title: 'Profile/MySummaryCard',
  component: MySummaryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '카드 제목',
    },
    value: {
      control: 'number',
      description: '표시할 값',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MySummaryCard>;

/**
 * 기본 MySummaryCard 예시
 */
export const Default: Story = {
  args: {
    title: '후원한 횟수',
    value: 15,
  },
};

/**
 * 대시보드 그리드 레이아웃에서의 사용 예시
 */
export const InDashboardGrid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        maxWidth: '400px',
      }}
    >
      <MySummaryCard title='후원한 횟수' value={15} />
      <MySummaryCard title='후원한 금액' value={10000} />
      <MySummaryCard title='후원 단체 수' value={2} />
      <MySummaryCard title='후원 강아지 수' value={3} />
    </div>
  ),
};
