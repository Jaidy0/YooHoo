import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DepositTableRow from './DepositTableRow';

const meta: Meta<typeof DepositTableRow> = {
  title: 'Components/Admin/DepositTableRow',
  component: DepositTableRow,
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
      description: '입출금 구분',
    },
    category: {
      control: 'text',
      description: '카테고리',
    },
    content: {
      control: 'text',
      description: '내용',
    },
    amount: {
      control: 'number',
      description: '금액',
    },
    date: {
      control: 'text',
      description: '날짜',
    },
    isEvidence: {
      control: 'boolean',
      description: '증빙자료 존재 여부',
    },
    evidence: {
      control: 'text',
      description: '증빙자료 링크',
    },
    isReceipt: {
      control: 'boolean',
      description: '영수증 존재 여부',
    },
    receipt: {
      control: 'text',
      description: '영수증 링크',
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
type Story = StoryObj<typeof DepositTableRow>;

export const Default: Story = {
  args: {
    variant: 'row',
    type: '지출',
    category: '운영비',
    content: '사무실 임대료',
    amount: 500000,
    date: '2025-03-26',
    isEvidence: true,
    evidence: 'https://example.com/evidence1',
    isReceipt: true,
    receipt: 'https://example.com/receipt1',
  },
};

export const HeaderRow: Story = {
  args: {
    variant: 'header',
    type: '구분',
    amount: 0,
    date: '날짜',
    isEvidence: false,
    isReceipt: false,
  },
};

export const WithoutDocuments: Story = {
  args: {
    variant: 'row',
    type: '지출',
    category: '물품구매',
    content: '사무용품 구매',
    amount: 120000,
    date: '2025-03-25',
    isEvidence: false,
    evidence: '',
    isReceipt: false,
    receipt: '',
  },
};

export const OnlyEvidence: Story = {
  args: {
    variant: 'row',
    type: '지출',
    category: '인건비',
    content: '아르바이트 급여',
    amount: 350000,
    date: '2025-03-24',
    isEvidence: true,
    evidence: 'https://example.com/evidence2',
    isReceipt: false,
    receipt: '',
  },
};

export const OnlyReceipt: Story = {
  args: {
    variant: 'row',
    type: '지출',
    category: '교통비',
    content: '택시비',
    amount: 15000,
    date: '2025-03-23',
    isEvidence: false,
    evidence: '',
    isReceipt: true,
    receipt: 'https://example.com/receipt2',
  },
};

export const Income: Story = {
  args: {
    variant: 'row',
    type: '수입',
    category: '후원금',
    content: '정기 후원',
    amount: 1000000,
    date: '2025-03-22',
    isEvidence: true,
    evidence: 'https://example.com/evidence3',
    isReceipt: true,
    receipt: 'https://example.com/receipt3',
  },
};

export const MultipleRows: Story = {
  render: () => (
    <div
      style={{
        width: '100%',
        maxWidth: '1192px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <DepositTableRow
        variant='header'
        type='구분'
        amount={0}
        date='날짜'
        isEvidence={false}
        isReceipt={false}
      />
      <DepositTableRow
        type='지출'
        category='운영비'
        content='사무실 임대료'
        amount={500000}
        date='2025-03-26'
        isEvidence={true}
        evidence='https://example.com/evidence1'
        isReceipt={true}
        receipt='https://example.com/receipt1'
      />
      <DepositTableRow
        type='지출'
        category='물품구매'
        content='사무용품 구매'
        amount={120000}
        date='2025-03-25'
        isEvidence={false}
        isReceipt={false}
      />
      <DepositTableRow
        type='수입'
        category='후원금'
        content='정기 후원'
        amount={1000000}
        date='2025-03-22'
        isEvidence={true}
        evidence='https://example.com/evidence3'
        isReceipt={true}
        receipt='https://example.com/receipt3'
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
        <DepositTableRow
          variant='header'
          type='구분'
          amount={0}
          date='날짜'
          isEvidence={false}
          isReceipt={false}
        />
        <DepositTableRow
          type='지출'
          category='운영비'
          content='사무실 임대료'
          amount={500000}
          date='2025-03-26'
          isEvidence={true}
          evidence='https://example.com/evidence1'
          isReceipt={true}
          receipt='https://example.com/receipt1'
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
        <DepositTableRow
          variant='header'
          type='구분'
          amount={0}
          date='날짜'
          isEvidence={false}
          isReceipt={false}
        />
        <DepositTableRow
          type='지출'
          category='운영비'
          content='사무실 임대료'
          amount={500000}
          date='2025-03-26'
          isEvidence={true}
          evidence='https://example.com/evidence1'
          isReceipt={true}
          receipt='https://example.com/receipt1'
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
