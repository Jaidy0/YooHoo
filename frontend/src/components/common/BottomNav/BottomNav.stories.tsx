// BottomNav.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import BottomNav from './BottomNav';
import { BottomNavItem } from './BottomNav';

const meta: Meta<typeof BottomNav> = {
  title: 'Navigation/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

const defaultItems: BottomNavItem[] = [
  {
    label: '홈',
    iconName: 'home',
    href: '/',
  },
  {
    label: '유기견',
    iconName: 'dog',
    href: '/dogs',
  },
  {
    label: '후원',
    iconName: 'bone',
    href: '/donate',
  },
  {
    label: '보호소',
    iconName: 'doghead',
    href: '/shelters',
  },
  {
    label: '마이페이지',
    iconName: 'bone',
    href: '/profile',
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const DogsActive: Story = {
  args: {
    items: defaultItems,
  },
};

export const DonateActive: Story = {
  args: {
    items: defaultItems,
  },
};

export const CustomItems: Story = {
  args: {
    items: [
      {
        label: '채팅',
        iconName: 'bell',
        href: '/chat',
      },
      {
        label: '일정',
        iconName: 'calendar',
        href: '/schedule',
      },
      {
        label: '쇼핑',
        iconName: 'cart',
        href: '/shop',
      },
    ],
  },
};
