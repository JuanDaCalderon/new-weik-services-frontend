import {ReactNode} from 'react';
import {Col, Form} from 'react-bootstrap';

interface OnlyLabelProps {
  label: string;
  error?: string;
  helperText?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  children?: ReactNode;
}

/**
 * A component that renders a label with an optional error message and helper text.
 */
export function OnlyLabel({label, error, helperText, xs, sm, md, lg, xl, xxl, children}: OnlyLabelProps) {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Group className="mb-2">
        <Form.Label htmlFor={label} className="mb-1">
          <strong>{label}</strong>
        </Form.Label>
        {children ?? null}
        <Form.Text className={error ? 'text-danger' : 'text-muted'}>{error || helperText}</Form.Text>
      </Form.Group>
    </Col>
  );
}
