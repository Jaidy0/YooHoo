// src/components/common/ImageUpload/ImageUpload.tsx
import { useRef, useEffect, useState, ChangeEvent, MouseEvent } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './ImageUpload.module.scss';

export interface ImageUploadProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  onError?: (message: string) => void;
  className?: string;
  error?: string;
  // 이미지 업로드 텍스트 커스텀 가능하도록 추가
  uploadText?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onError,
  className = '',
  error,
  uploadText,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const pathname = usePathname();

  const isSharing = pathname?.includes('sharing');
  const isSight = pathname?.includes('sight');

  // value가 변경될 때마다 preview 업데이트
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      onChange(null);
      return;
    }

    // 5MB = 5 * 1024 * 1024 bytes
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      onError?.('파일 크기는 5MB를 초과할 수 없습니다.');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    onChange(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const renderUploadText = () => {
    // 커스텀 텍스트가 있으면 해당 텍스트 사용
    if (uploadText) {
      return (
        <span className={error ? styles.errorText : styles.guideText}>
          {uploadText}
        </span>
      );
    }

    const textClassName = error ? styles.errorText : styles.guideText;

    if (isSharing) {
      return (
        <>
          <span className={textClassName}>강아지 사진을</span>
          <span className={textClassName}>업로드해주세요</span>
        </>
      );
    } else if (isSight) {
      return (
        <>
          <span className={textClassName}>증빙 자료를 업로드 해주세요.</span>
        </>
      );
    }

    return <span className={textClassName}>이미지를 업로드 해주세요</span>;
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <input
        type='file'
        ref={inputRef}
        className={styles.hiddenInput}
        accept='image/*'
        onChange={handleImageChange}
      />
      <div className={styles.wrapper}>
        <div
          className={`${styles.uploadContainer} ${error ? styles.errorBorder : ''}`}
          onClick={handleClick}
        >
          {preview ? (
            <div className={styles.previewContainer}>
              <Image
                src={preview}
                alt='업로드된 이미지 미리보기'
                fill
                className={styles.previewImage}
                sizes='(max-width: 128px) 100vw, 128px'
                priority={false}
              />
              <button
                type='button'
                onClick={handleRemove}
                className={styles.removeButton}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={styles.xIcon}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18 18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className={styles.uploadPlaceholder}>
              {renderUploadText()}
              <div className={styles.plusButtonContainer}>
                <div className={styles.plusButton}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className={styles.plusIcon}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
}
