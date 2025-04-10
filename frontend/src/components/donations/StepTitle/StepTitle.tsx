import styles from './StepTitle.module.scss';

type StepTitleProps = {
  number: number;
  title: string;
  className?: string;
};

export default function StepTitle({
  number,
  title,
  className = '',
}: StepTitleProps) {
  return (
    <div className={`${styles.stepTitle} ${className}`}>
      <span className={styles.stepNumber}>{number}.</span>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
