// src/components/common/Pagination/Pagination.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Pagination from './Pagination';

// 메타데이터 정의
const meta: Meta<typeof Pagination> = {
  title: 'Common/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '현재 페이지 번호',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '전체 페이지 수',
    },
    pageRangeDisplayed: {
      control: { type: 'number', min: 1 },
      description: '화면에 표시할 페이지 번호 개수',
    },
    onPageChange: {
      action: 'page changed',
      description: '페이지 변경 시 호출되는 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// 기본 스토리
export const Default: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    pageRangeDisplayed: 5,
  },
};

// 첫 페이지 스토리
export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    pageRangeDisplayed: 5,
  },
};

// 마지막 페이지 스토리
export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    pageRangeDisplayed: 5,
  },
};

// 페이지 수가 많은 경우
export const ManyPages: Story = {
  args: {
    currentPage: 50,
    totalPages: 100,
    pageRangeDisplayed: 5,
  },
};

// 페이지 수가 적은 경우
export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    pageRangeDisplayed: 5,
  },
};

// 인터랙티브 스토리 (상태 변경이 가능한 예제)
export const Interactive: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 1);

    return (
      <Pagination
        {...args}
        currentPage={page}
        totalPages={args.totalPages}
        pageRangeDisplayed={args.pageRangeDisplayed}
        onPageChange={(newPage) => {
          setPage(newPage);
          args.onPageChange?.(newPage);
        }}
      />
    );
  },
  args: {
    currentPage: 1,
    totalPages: 20,
    pageRangeDisplayed: 5,
  },
};

// 모바일 화면 페이지네이션 (더 적은 페이지 범위 표시)
export const MobileView: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    pageRangeDisplayed: 3,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// 커스텀 스타일링 예제 (CSS 모듈에서 별도 클래스를 지정해야 함)
export const CustomStyling: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    pageRangeDisplayed: 5,
  },
  decorators: [
    (Story) => (
      <div
        style={{ padding: '20px', background: '#f6f4e8', borderRadius: '8px' }}
      >
        <Story />
      </div>
    ),
  ],
};

// 브랜드 테마 배경에서의 페이지네이션
export const OnBrandBackground: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    pageRangeDisplayed: 5,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '30px',
          background: '#7c514d',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
