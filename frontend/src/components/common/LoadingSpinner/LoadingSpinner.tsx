import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({
  size = 'medium',
  color = '#FF6B6B',
}: LoadingSpinnerProps) {
  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles.bounce1} style={{ backgroundColor: color }}></div>
      <div className={styles.bounce2} style={{ backgroundColor: color }}></div>
      <div className={styles.bounce3} style={{ backgroundColor: color }}></div>
    </div>
  );
}
