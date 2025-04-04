import React from 'react';

interface MedalIconProps {
  className?: string;
}

export default function MedalIcon({ className = '' }: MedalIconProps) {
  return (
    <svg
      width='40'
      height='40'
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <circle
        cx='20'
        cy='20'
        r='18'
        fill='#FFCB45'
        stroke='#E5A82B'
        strokeWidth='2'
      />
      <path
        d='M20 10C15 10 11 14 11 19C11 24 15 28 20 28C25 28 29 24 29 19C29 14 25 10 20 10ZM20 26C16.13 26 13 22.87 13 19C13 15.13 16.13 12 20 12C23.87 12 27 15.13 27 19C27 22.87 23.87 26 20 26Z'
        fill='#6E4525'
      />
      <path
        d='M20 14C17.24 14 15 16.24 15 19C15 21.76 17.24 24 20 24C22.76 24 25 21.76 25 19C25 16.24 22.76 14 20 14ZM20 22C18.34 22 17 20.66 17 19C17 17.34 18.34 16 20 16C21.66 16 23 17.34 23 19C23 20.66 21.66 22 20 22Z'
        fill='#6E4525'
      />
      <path
        d='M20 18C19.45 18 19 18.45 19 19C19 19.55 19.45 20 20 20C20.55 20 21 19.55 21 19C21 18.45 20.55 18 20 18Z'
        fill='#6E4525'
      />
    </svg>
  );
}
