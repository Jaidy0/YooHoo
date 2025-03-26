import styles from './ProgressBar.module.scss';

type ProgressBarProps = {
  progress: number; // 0-100 사이의 값
  className?: string;
};

export default function ProgressBar({
  progress,
  className = '',
}: ProgressBarProps) {
  const validProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`${styles.progressContainer} ${className}`}>
      <div
        className={styles.progressBar}
        style={{ width: `${validProgress}%` }}
        role='progressbar'
        aria-valuenow={validProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
