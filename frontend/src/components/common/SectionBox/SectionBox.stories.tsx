import type { Meta, StoryObj } from '@storybook/react';
import SectionBox from './SectionBox';

const meta: Meta<typeof SectionBox> = {
  title: 'Components/Common/SectionBox',
  component: SectionBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SectionBox>;

export const Default: Story = {
  args: {
    title: '제목',
    subtitle: '소제목',
    children: (
      <div style={{ height: 120, backgroundColor: '#fff' }}>
        내부 콘텐츠 영역입니다.
      </div>
    ),
  },
};

export const OnlyTitle: Story = {
  args: {
    title: '제목만 있는 경우',
    children: (
      <div style={{ height: 80, backgroundColor: '#fff' }}>
        내용이 들어갑니다.
      </div>
    ),
  },
};

export const OnlySubtitle: Story = {
  args: {
    subtitle: '소제목만 있는 경우',
    children: (
      <div style={{ height: 80, backgroundColor: '#fff' }}>
        내용이 들어갑니다.
      </div>
    ),
  },
};

export const WithoutHeader: Story = {
  args: {
    children: (
      <div style={{ height: 80, backgroundColor: '#fff' }}>
        제목/소제목 없이 내용만 있는 경우입니다.
      </div>
    ),
  },
};
