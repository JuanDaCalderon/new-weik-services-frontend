import {SendButtonProps} from '@/types';
import {memo} from 'react';
import {Button} from 'react-bootstrap';
import {Spinner} from '@/components';

const SendButton = memo(function SendButton({loading, text}: SendButtonProps) {
  return (
    <div className="text-center">
      <Button className="w-100" variant="primary" type="submit" disabled={loading}>
        {loading && <Spinner className="spinner-border-sm me-1" tag="span" color="white" />}
        {!loading && text}
      </Button>
    </div>
  );
});

export {SendButton};
