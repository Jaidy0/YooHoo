import { useState } from 'react';
import styles from './ReceiptUploadModal.module.scss';
import Modal from '@/components/common/Modal/Modal';
import Button from '@/components/common/buttons/Button/Button';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';
import { useReceipt } from '@/hooks/useReceipt';

export interface ReceiptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawId: number;
  onUploadSuccess?: () => void; // 단순히 성공 여부만 전달
}

export default function ReceiptUploadModal({
  isOpen,
  onClose,
  withdrawId,
  onUploadSuccess,
}: ReceiptUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  // useReceipt 훅 사용
  const { uploadReceiptImage, isLoading } = useReceipt(withdrawId, {
    // 성공 시 콜백
    onSuccess: () => {
      // 모달 닫기 및 성공 콜백 호출
      onClose();

      // 업로드 성공 시 부모 컴포넌트에 알림
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    },
    // 에러 발생 시 콜백
    onError: (error) => {
      setUploadError(
        '활동내용 업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
      console.error('활동내용 업로드 오류:', error);
    },
  });

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError('업로드할 활동내용 이미지를 선택해주세요.');
      return;
    }

    try {
      await uploadReceiptImage(selectedFile);
      // 성공 처리는 onSuccess 콜백에서 수행
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // 에러 처리는 onError 콜백에서 수행
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setUploadError('');
  };

  const handleImageError = (message: string) => {
    setUploadError(message);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='활동내용 업로드'
      className={styles.modal}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.description}>
            활동내용 이미지를 업로드해주세요.
          </p>

          <ImageUpload
            value={selectedFile}
            onChange={handleFileChange}
            onError={handleImageError}
            className={styles.imageUpload}
            error={uploadError}
            uploadText='활동내용 이미지를 업로드해주세요'
          />
        </div>

        <div className={styles.footer}>
          <Button onClick={onClose} variant='outline'>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant='primary'
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? '업로드 중...' : '업로드'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
