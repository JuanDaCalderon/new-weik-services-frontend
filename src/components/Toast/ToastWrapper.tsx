import {TOAST_DURATION} from '@/constants';
import {memo, ReactNode} from 'react';
import {Toaster} from 'react-hot-toast';

interface ToastWrapperProps {
  children: ReactNode;
  toastDuration?: number;
}

const ToastWrapper = memo(function ToastWrapper({children, toastDuration = TOAST_DURATION}: ToastWrapperProps) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: toastDuration,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
});

export {ToastWrapper};
