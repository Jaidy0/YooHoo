import type { Meta, StoryObj } from '@storybook/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: { control: 'text' },
    onBackClick: { action: 'back clicked' },
    onNotificationClick: { action: 'notification clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: '서브 페이지 제목',
  },
};

export const WithBackButton: Story = {
  args: {
    title: '서브 페이지 제목',
    onBackClick: () => alert('Back button clicked'),
  },
};

export const WithNotificationButton: Story = {
  args: {
    title: '서브 페이지 제목',
    onNotificationClick: () => alert('Notification button clicked'),
  },
};

export const FullHeader: Story = {
  args: {
    title: '서브 페이지 제목',
    onBackClick: () => alert('Back button clicked'),
    onNotificationClick: () => alert('Notification button clicked'),
  },
};
