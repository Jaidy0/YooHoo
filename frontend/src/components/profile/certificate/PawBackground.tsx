import React from 'react';

interface PawBackgroundProps {
  className?: string;
}

export default function PawBackground({ className = '' }: PawBackgroundProps) {
  return (
    <svg
      width='150'
      height='150'
      viewBox='0 0 150 150'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M75 112.5C75 107.5 69.1 102 62.5 102C55.9 102 50 107.5 50 112.5C50 117.5 55.9 125 62.5 125C69.1 125 75 117.5 75 112.5Z'
        fill='currentColor'
      />
      <path
        d='M100 112.5C100 107.5 94.1 102 87.5 102C80.9 102 75 107.5 75 112.5C75 117.5 80.9 125 87.5 125C94.1 125 100 117.5 100 112.5Z'
        fill='currentColor'
      />
      <path
        d='M112.5 85C112.5 80 106.6 75 100 75C93.4 75 87.5 80 87.5 85C87.5 90 93.4 97.5 100 97.5C106.6 97.5 112.5 90 112.5 85Z'
        fill='currentColor'
      />
      <path
        d='M62.5 85C62.5 80 56.6 75 50 75C43.4 75 37.5 80 37.5 85C37.5 90 43.4 97.5 50 97.5C56.6 97.5 62.5 90 62.5 85Z'
        fill='currentColor'
      />
      <path
        d='M93.75 56.25C93.75 44.37 83.13 35 75 35C66.87 35 56.25 44.37 56.25 56.25C56.25 68.13 66.87 85 75 85C83.13 85 93.75 68.13 93.75 56.25Z'
        fill='currentColor'
      />
    </svg>
  );
}
