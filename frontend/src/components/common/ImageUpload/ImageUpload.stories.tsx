// src/components/common/ImageUpload/ImageUpload.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ImageUpload from './ImageUpload';

const meta: Meta<typeof ImageUpload> = {
  title: 'Components/Common/ImageUpload',
  component: ImageUpload,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    onError: { action: 'error' },
    error: { control: 'text' },
    uploadText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<File | string | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleChange = (file: File | null) => {
      setValue(file);
      setError(undefined);
    };

    const handleError = (message: string) => {
      setError(message);
    };

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <ImageUpload
          {...args}
          value={value}
          onChange={handleChange}
          onError={handleError}
          error={error}
        />
      </div>
    );
  },
};

export const WithText: Story = {
  render: (args) => {
    const [value, setValue] = useState<File | string | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);

    const handleChange = (file: File | null) => {
      setValue(file);
      setError(undefined);
    };

    const handleError = (message: string) => {
      setError(message);
    };

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <ImageUpload
          {...args}
          value={value}
          onChange={handleChange}
          onError={handleError}
          error={error}
          uploadText='강아지 사진을 업로드해주세요'
        />
      </div>
    );
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState<File | string | null>(null);

    const handleChange = (file: File | null) => {
      setValue(file);
    };

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <ImageUpload
          {...args}
          value={value}
          onChange={handleChange}
          error='필수 항목입니다.'
        />
      </div>
    );
  },
};
