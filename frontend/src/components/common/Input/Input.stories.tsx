import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Common/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '입력 필드 제목',
    },
    placeHolder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    isAvail: {
      control: 'boolean',
      description: '입력 필드 활성화 여부',
    },
    hasError: {
      control: 'boolean',
      description: '에러 상태 여부',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel'],
      description: '입력 필드 타입',
    },
    width: {
      control: 'text',
      description: '입력 필드 너비 (예: "100%", "300px")',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const 기본: Story = {
  args: {
    title: '제목',
    placeHolder: '검색어를 입력하세요',
    isAvail: true,
  },
};

export const 비활성화: Story = {
  args: {
    title: '비활성화된 입력 필드',
    placeHolder: '이 필드는 비활성화되어 있습니다',
    isAvail: false,
  },
};

export const 이메일입력: Story = {
  args: {
    title: '이메일',
    placeHolder: '이메일 주소를 입력하세요',
    isAvail: true,
    type: 'email',
  },
};

export const 긴제목: Story = {
  args: {
    title: '아주 긴 제목의 입력 필드 예시입니다',
    placeHolder: '긴 제목 테스트',
    isAvail: true,
  },
};

export const 에러상태: Story = {
  args: {
    title: '이메일',
    placeHolder: '이메일 주소를 입력하세요',
    isAvail: true,
    hasError: true,
    errorMessage: '올바른 이메일 형식이 아닙니다',
    type: 'email',
  },
};

export const 비밀번호: Story = {
  args: {
    title: '비밀번호',
    placeHolder: '비밀번호를 입력하세요',
    isAvail: true,
    type: 'password',
  },
};

export const 필수입력필드_에러: Story = {
  args: {
    title: '이름 (필수)',
    placeHolder: '이름을 입력하세요',
    isAvail: true,
    hasError: true,
    errorMessage: '이름은 필수 입력 항목입니다',
  },
};

export const 커스텀너비: Story = {
  args: {
    title: '검색',
    placeHolder: '검색어 입력',
    isAvail: true,
    width: '300px',
  },
};
