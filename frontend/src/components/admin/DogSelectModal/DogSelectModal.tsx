import React from 'react';
import Modal from '@/components/common/Modal/Modal';

interface DogSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function DogSelectModal({
  isOpen,
  onClose,
  title,
  children,
}: DogSelectModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Modal>
  );
}
