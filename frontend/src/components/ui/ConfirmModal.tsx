import React from 'react';
import Modal from './Modal';
import Button from './Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="flex flex-col gap-6">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {message}
        </p>
        <div className="flex justify-end gap-3 border-t border-outline-variant pt-4 mt-2">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onCancel();
            }} 
            variant="primary" 
            className={isDestructive ? 'bg-error text-on-error hover:bg-error/90 border-error' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
