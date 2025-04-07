import {InputHTMLAttributes} from 'react';
import {Col, Form} from 'react-bootstrap';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
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
 * InputField component to render a Bootstrap input field with label and error handling.
 * @param {string} label - The label for the input field.
 * @param {string} error - The error message to display if the input is invalid.
 * @param {string} helperText - The helper text to display below the input field.
 * @param {number} xs - Bootstrap grid size for extra small devices.
 * @param {number} sm - Bootstrap grid size for small devices.
 * @param {number} md - Bootstrap grid size for medium devices.
 * @param {number} lg - Bootstrap grid size for large devices.
 * @param {number} xl - Bootstrap grid size for extra large devices.
 * @param {number} xxl - Bootstrap grid size for extra extra large devices.
 */
export function InputField({
  label,
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
}: InputFieldProps) {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Group className="mb-2">
        <Form.Label htmlFor={label} className="mb-1">
          <strong>{label}</strong>
        </Form.Label>
        <Form.Control
          {...{
            ...props,
            id: label,
            size: controlSize,
            value: props.value as string | number | string[] | undefined,
            placeholder: props.placeholder ? props.placeholder : label
          }}
          isInvalid={!!error}
        />
        <Form.Text className={error ? 'text-danger' : 'text-muted'}>{error || helperText}</Form.Text>
      </Form.Group>
    </Col>
  );
}
