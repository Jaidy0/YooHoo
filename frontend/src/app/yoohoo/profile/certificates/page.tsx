'use client';

import { useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useDonationStats } from '@/hooks/donations/useDonationStats';
import Button from '@/components/common/buttons/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';
import html2canvas from 'html2canvas';
import DonationCertificate from '@/components/profile/certificate/DonationCertificate/DonationCertificate';
import styles from './page.module.scss';

export default function MyCertificatesPage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { stats } = useDonationStats();
  const [isDownloading, setIsDownloading] = useState(false);

  // Get current date for the certificate
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;

  // Handle download button click
  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher quality
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `유후_후원증서_${user?.nickname || '후원자'}_${currentDate.getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle share button click
  const handleShare = async () => {
    if (!certificateRef.current) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      if (navigator.share) {
        await navigator.share({
          title: '유후 후원증서',
          text: '저는 유기견 후원 플랫폼 유후를 통해 후원했어요!',
          files: [
            new File([blob], 'donation-certificate.png', { type: 'image/png' }),
          ],
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        alert(
          '공유하기 기능이 지원되지 않는 브라우저입니다. 다운로드 후 공유해주세요.'
        );
        handleDownload();
      }
    } catch (error) {
      console.error('Failed to share certificate:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.certificatePage}>
      <h1 className={styles.pageTitle}>마이 후원증서</h1>

      <div className={styles.certificateContainer}>
        {/* Using the DonationCertificate component with ref for download/share */}
        <div ref={certificateRef}>
          <DonationCertificate
            username={user?.nickname || '후원자'}
            amount={stats.totalAmount || 0}
            date={formattedDate}
          />
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <Button
          variant='primary'
          className={styles.shareButton}
          onClick={handleShare}
          leftIcon={<IconBox name='share' size={20} />}
          disabled={isDownloading}
        >
          공유하기
        </Button>

        <Button
          variant='primary'
          className={styles.downloadButton}
          onClick={handleDownload}
          leftIcon={<IconBox name='download' size={20} />}
          disabled={isDownloading}
        >
          파일 다운로드
        </Button>
      </div>
    </div>
  );
}
