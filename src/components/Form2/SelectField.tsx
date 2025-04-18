import {InputHTMLAttributes} from 'react';
import {Col, Form} from 'react-bootstrap';
import {Option} from '@/types';

interface SelectFieldProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  helperText?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  controlSize?: 'sm' | 'lg' | undefined;
}

/**
 * selectField component to render a Bootstrap input field with label and error handling.
 */
export function SelectField({
  label,
  options,
  error,
  helperText,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  controlSize = 'sm',
  ...props
}: SelectFieldProps) {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Group className="mb-2">
        <Form.Label htmlFor={label} className="mb-1">
          <strong>{label}</strong>
        </Form.Label>
        <Form.Select
          {...{
            ...props,
            id: label,
            size: controlSize,
            value: props.value as string | number | string[] | undefined,
            placeholder: props.placeholder ? props.placeholder : label
          }}
          isInvalid={!!error}>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
        <Form.Text className={error ? 'text-danger' : 'text-muted'}>{error || helperText}</Form.Text>
      </Form.Group>
    </Col>
  );
}
