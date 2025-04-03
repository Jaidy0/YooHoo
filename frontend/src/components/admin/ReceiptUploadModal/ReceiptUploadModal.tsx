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
  onUploadSuccess?: () => void; // 업로드 성공 시 호출할 콜백
}

export default function ReceiptUploadModal({
  isOpen,
  onClose,
  withdrawId,
  onUploadSuccess,
}: ReceiptUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  const { uploadReceiptImage, isLoading } = useReceipt(withdrawId, {
    onSuccess: () => {
      onClose();
      onUploadSuccess?.(); // 업로드 성공 후 부모 컴포넌트에 알림
    },
    onError: (error) => {
      setUploadError(
        '영수증 업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
      console.error('영수증 업로드 오류:', error);
    },
    onDataChange: () => {
      // 필요한 경우 여기에서 추가 작업 수행
      onUploadSuccess?.(); // 데이터 변경 시 부모 컴포넌트에 알림
    },
  });

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError('업로드할 영수증 이미지를 선택해주세요.');
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await uploadReceiptImage(selectedFile);
      // 업로드 성공 시 처리는 onSuccess와 onDataChange에서 처리됨
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // 에러는 훅에서 처리됨
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
      title='영수증 업로드'
      className={styles.modal}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.description}>
            영수증 이미지를 업로드해주세요. (최대 5MB)
          </p>

          <ImageUpload
            value={selectedFile}
            onChange={handleFileChange}
            onError={handleImageError}
            className={styles.imageUpload}
            error={uploadError}
            uploadText='영수증 이미지를 업로드해주세요'
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
