import {ReactNode} from 'react';

export type ModalProps = {
  show: boolean;
  onToggle: () => void;
  headerText: string;
  submitText?: string;
  secondaryText?: string;
  body: ReactNode;
  onSend?: <T>(data: T) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: string;
  onHide?: () => void;
  onShow?: () => void;
  showFooter?: boolean;
  size?: 'sm' | 'lg' | 'xl';
};
