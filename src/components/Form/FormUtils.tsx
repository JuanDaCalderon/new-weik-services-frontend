import {FeedbackInvalidProps, LabelProps} from '@/types';
import {memo} from 'react';
import {Form} from 'react-bootstrap';

const LabelText = memo(function LabelText({label, htmlFor = ''}: LabelProps) {
  return (
    <Form.Label className="text-dark text-opacity-75" htmlFor={htmlFor}>
      {label}
    </Form.Label>
  );
});

const FeedbackInvalidText = memo(function FeedbackInvalidText({
  errorMessage,
  customClassNames = ''
}: FeedbackInvalidProps) {
  return (
    <Form.Control.Feedback type="invalid" className={customClassNames}>
      {errorMessage}
    </Form.Control.Feedback>
  );
});

export {LabelText, FeedbackInvalidText};
