import type { Meta, StoryObj } from '@storybook/react';
import WithdrawTableRow from './WithdrawTableRow';
import { useState } from 'react';

const meta: Meta<typeof WithdrawTableRow> = {
  title: 'Components/Admin/WithdrawTableRow',
  component: WithdrawTableRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['header', 'row'],
      description: '테이블 행의 유형 (제목 행 또는 일반 행)',
    },
    type: {
      control: 'text',
      description: '출금 유형',
    },
    name: {
      control: 'text',
      description: '이름 또는 계좌 정보',
    },
    amount: {
      control: 'number',
      description: '출금 금액',
    },
    message: {
      control: 'text',
      description: '메시지 내용 (선택적)',
    },
    date: {
      control: 'text',
      description: '출금 날짜',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '1192px',
          maxWidth: '100%',
          margin: '0 auto',
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WithdrawTableRow>;

export const Default: Story = {
  args: {
    variant: 'row',
    type: '출금',
    name: '홍길동',
    amount: 50000,
    message: '월세 지급',
    date: '2025-03-26',
  },
};

export const HeaderRow: Story = {
  args: {
    variant: 'header',
    type: '유형',
    name: '이름',
    amount: 0,
    message: '메시지',
    date: '날짜',
  },
};

export const LargeAmount: Story = {
  args: {
    variant: 'row',
    type: '출금',
    name: '김철수',
    amount: 1000000,
    message: '연간 회비',
    date: '2025-03-25',
  },
};

export const NoMessage: Story = {
  args: {
    variant: 'row',
    type: '출금',
    name: '이영희',
    amount: 15000,
    date: '2025-03-24',
  },
};

export const MultipleRows: Story = {
  render: () => (
    <div
      style={{
        width: '1192px',
        maxWidth: '100%',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <WithdrawTableRow
        variant='header'
        type='유형'
        name='이름'
        amount={0}
        message='메시지'
        date='날짜'
      />
      <WithdrawTableRow
        type='출금'
        name='홍길동'
        amount={50000}
        message='월세 지급'
        date='2025-03-26'
      />
      <WithdrawTableRow
        type='입금'
        name='김철수'
        amount={100000}
        message='후원금'
        date='2025-03-25'
      />
      <WithdrawTableRow
        type='출금'
        name='이영희'
        amount={15000}
        date='2025-03-24'
      />
    </div>
  ),
};

// ResponsiveTest는 함수형 컴포넌트로 작성해야 useState를 사용할 수 있습니다
const ResponsiveTestComponent = () => {
  const [containerWidth, setContainerWidth] = useState(1192);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '1192px',
          marginBottom: '32px',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
        }}
      >
        <h3
          style={{
            margin: '16px 0 8px',
            fontSize: '16px',
            color: '#555',
            padding: '0 16px',
          }}
        >
          고정 너비 (1192px)
        </h3>
        <WithdrawTableRow
          variant='header'
          type='유형'
          name='이름'
          amount={0}
          message='메시지'
          date='날짜'
        />
        <WithdrawTableRow
          type='출금'
          name='홍길동'
          amount={50000}
          message='월세 지급'
          date='2025-03-26'
        />
      </div>

      <div
        style={{
          width: `${containerWidth}px`,
          marginBottom: '32px',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          transition: 'width 0.3s ease',
        }}
      >
        <h3
          style={{
            margin: '16px 0 8px',
            fontSize: '16px',
            color: '#555',
            padding: '0 16px',
          }}
        >
          반응형 너비 ({containerWidth}px)
        </h3>
        <WithdrawTableRow
          variant='header'
          type='유형'
          name='이름'
          amount={0}
          message='메시지'
          date='날짜'
        />
        <WithdrawTableRow
          type='출금'
          name='홍길동'
          amount={50000}
          message='월세 지급'
          date='2025-03-26'
        />
      </div>

      <div
        style={{
          margin: '20px 0',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '14px',
            color: '#555',
          }}
        >
          컨테이너 너비 조절: {containerWidth}px
          <input
            type='range'
            min='600'
            max='1400'
            value={containerWidth}
            onChange={(e) => setContainerWidth(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </label>
      </div>
    </div>
  );
};

export const ResponsiveTest: Story = {
  render: () => <ResponsiveTestComponent />,
};
