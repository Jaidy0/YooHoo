// SearchBar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '검색창 placeholder 텍스트',
    },
    initialValue: {
      control: 'text',
      description: '초기 검색어',
    },
    onSearch: {
      action: 'searched',
      description: '검색 제출 핸들러',
    },
    fullWidth: {
      control: 'boolean',
      description: '검색창 너비 스타일',
    },
    className: {
      control: 'text',
      description: '추가 클래스명',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

// 기본 검색바
export const Default: Story = {
  args: {
    placeholder: '찾으시는 단체 이름을 입력해주세요.',
  },
};

// 초기값이 있는 검색바
export const WithInitialValue: Story = {
  args: {
    placeholder: '찾으시는 단체 이름을 입력해주세요.',
    initialValue: '유기견',
  },
};

// 전체 너비 검색바
export const FullWidth: Story = {
  args: {
    placeholder: '찾으시는 단체 이름을 입력해주세요.',
    fullWidth: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// 다양한 placeholder 검색바
export const DifferentPlaceholders: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '300px',
      }}
    >
      <SearchBar placeholder='유기견 검색' />
      <SearchBar placeholder='보호소 찾기' />
      <SearchBar placeholder='후원하기' />
    </div>
  ),
};

// 검색 이벤트 로깅 예시
export const WithSearchLogging: Story = {
  args: {
    placeholder: '검색어를 입력하세요',
    onSearch: (searchTerm) => console.log(`검색어: ${searchTerm}`),
  },
};

// 모바일 화면 시뮬레이션
export const MobileView: Story = {
  args: {
    placeholder: '찾으시는 단체 이름을 입력해주세요.',
    fullWidth: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '10px' }}>
        <Story />
      </div>
    ),
  ],
};
