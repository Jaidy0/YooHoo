'use client';

import styles from './MessageInput.module.scss';

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  targetType?: 'shelter' | 'dog';
};

export default function MessageInput({
  value,
  onChange,
  targetType = 'shelter',
}: MessageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const getPlaceholder = () => {
    return targetType === 'shelter'
      ? '강아지들에게 응원의 메시지를 남겨주세요!'
      : '강아지에게 응원의 메시지를 남겨주세요!';
  };

  return (
    <div className={styles.messageContainer}>
      <label htmlFor='supportMessage'>응원 메시지 (선택)</label>
      <textarea
        id='supportMessage'
        value={value}
        onChange={handleChange}
        placeholder={getPlaceholder()}
        className={styles.messageTextarea}
      />
    </div>
  );
}
