import {ReactNode} from 'react';

export type ModalProps = {
  show: boolean;
  onToggle: () => void;
  headerText: string;
  submitText?: string;
  secondaryText?: string;
  deleteText?: string;
  body: ReactNode;
  showSendButton?: boolean;
  onSend?: <T>(data: T) => void;
  onDelete?: <T>(data: T) => void;
  onClose?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: string;
  onHide?: () => void;
  onShow?: () => void;
  showFooter?: boolean;
  showDeleteButton?: boolean;
  size?: 'sm' | 'lg' | 'xl';
};
