import type { Meta, StoryObj } from '@storybook/react';
import MyHistoryCard, { MyHistoryCardProps } from './MyHistoryCard';

const meta: Meta<typeof MyHistoryCard> = {
  title: 'Components/MyHistoryCard',
  component: MyHistoryCard,
  argTypes: {
    badgeText: { control: 'text', description: '뱃지 텍스트' },
    subText: { control: 'text', description: '서브 텍스트' },
    mainText: { control: 'text', description: '메인 텍스트' },
    date: { control: 'text', description: '날짜 정보' },
    variant: {
      control: 'radio',
      options: ['history', 'alarm'],
      description: '카드 타입 (history 또는 alarm)',
    },
  },
};

export default meta;
type Story = StoryObj<MyHistoryCardProps>;

/**
 * ✅ 기본 히스토리 카드
 */
export const History: Story = {
  args: {
    badgeText: '일시 후원',
    subText: '간장치킨 보호소(보미)',
    mainText: '10,000원',
    date: '2024-03-24',
    variant: 'history',
  },
};

/**
 * ✅ 알람 카드
 */
export const Alarm: Story = {
  args: {
    badgeText: '간장치킨 보호소',
    subText: '미나리 님이 후원하신',
    mainText: '반디가 새로운 가족을 찾았어요!',
    date: '2024-03-24',
    variant: 'alarm',
  },
};
