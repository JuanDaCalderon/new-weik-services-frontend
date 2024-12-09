import {LabelWithControlProps} from '@/types';
import {memo} from 'react';
import {Form} from 'react-bootstrap';

const LabelWithControl = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange
}: LabelWithControlProps) => (
  <>
    <Form.Label className="text-dark cursor-pointer mb-0 mt-1" htmlFor={id}>
      <strong>{label}:</strong>
    </Form.Label>
    <Form.Control size="sm" type={type} id={id} name={name} value={value} onChange={onChange} />
  </>
);

export default memo(LabelWithControl);
