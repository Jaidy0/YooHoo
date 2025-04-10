import type { Meta, StoryObj } from '@storybook/react';
import RatingScale from './RatingScale';

// 메타데이터 정의
const meta = {
  title: 'Components/Common/RatingScale',
  component: RatingScale,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxRating: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: '최대 평점 값',
    },
    value: {
      control: { type: 'range', min: 0, max: 10, step: 1 },
      description: '현재 선택된 평점',
    },
    onChange: {
      action: 'changed',
      description: '평점 변경 시 호출될 함수',
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용 모드 여부',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스명',
    },
  },
} satisfies Meta<typeof RatingScale>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 사용 예시
export const Default: Story = {
  args: {
    maxRating: 5,
    value: 3,
    readOnly: false,
  },
};

// 읽기 전용 모드
export const ReadOnly: Story = {
  args: {
    maxRating: 5,
    value: 4,
    readOnly: true,
  },
};

// 다양한 최대값
export const CustomMaxRating: Story = {
  args: {
    maxRating: 10,
    value: 7,
    readOnly: false,
  },
};

// 크기 변형 예시
export const Sizes: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3>작은 크기</h3>
          <RatingScale value={3} className='small' />
        </div>
        <div>
          <h3>기본 크기</h3>
          <RatingScale value={3} />
        </div>
        <div>
          <h3>큰 크기</h3>
          <RatingScale value={3} className='large' />
        </div>
      </div>
    );
  },
};
