'use client';

import { useState, useEffect } from 'react';
import styles from './AccountNameRadio.module.scss';

type AccountNameRadioProps = {
  value: string;
  onChange: (value: string) => void;
  nickname: string;
};

export default function AccountNameRadio({
  value,
  onChange,
  nickname,
}: AccountNameRadioProps) {
  const [inputValue, setInputValue] = useState(value);
  const [selectedOption, setSelectedOption] = useState<
    'nickname' | 'input' | 'unknown'
  >('nickname');

  useEffect(() => {
    onChange(nickname);
  }, []);

  const handleOptionChange = (option: 'nickname' | 'input' | 'unknown') => {
    setSelectedOption(option);

    switch (option) {
      case 'nickname':
        onChange(nickname);
        break;
      case 'input':
        onChange(inputValue);
        break;
      case 'unknown':
        onChange('익명');
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (selectedOption === 'input') {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.accountNameRadio}>
      <div className={styles.optionsContainer}>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type='radio'
              name='accountName'
              checked={selectedOption === 'nickname'}
              onChange={() => handleOptionChange('nickname')}
            />
            <span>닉네임</span>
          </label>

          <label className={styles.radioLabel}>
            <input
              type='radio'
              name='accountName'
              checked={selectedOption === 'unknown'}
              onChange={() => handleOptionChange('unknown')}
            />
            <span>익명</span>
          </label>

          <label className={styles.radioLabel}>
            <input
              type='radio'
              name='accountName'
              checked={selectedOption === 'input'}
              onChange={() => handleOptionChange('input')}
            />
            <span>직접 입력</span>
          </label>
        </div>

        {selectedOption === 'nickname' && (
          <div className={styles.nicknameContainer}>
            <span className={styles.nicknameDisplay}>{nickname}</span>
          </div>
        )}
      </div>

      {selectedOption === 'input' && (
        <div className={styles.inputContainer}>
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            placeholder='입금자명을 입력하세요'
            className={styles.accountNameInput}
          />
        </div>
      )}
    </div>
  );
}
