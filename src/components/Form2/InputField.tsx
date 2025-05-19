import {InputHTMLAttributes} from 'react';
import {Col, Form, Row} from 'react-bootstrap';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  controlSize?: 'sm' | 'lg' | undefined;
  as?: 'input' | 'textarea' | undefined;
  bottomMargin?: 0 | 1 | 2 | 3 | 4 | 5;
  labelPosition?: 'top' | 'left' | 'right';
  rows?: number;
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
  as,
  bottomMargin = 2,
  labelPosition = 'top',
  rows,
  ...props
}: InputFieldProps) {
  const renderInput = () => (
    <Form.Control
      {...{
        ...props,
        id: label,
        size: controlSize,
        value: props.value as string | number | string[] | undefined,
        placeholder: props.placeholder ?? label,
        rows: rows
      }}
      as={as}
      isInvalid={!!error}
    />
  );

  const renderLabel = (labelMargin: 0 | 1 | 2 | 3 | 4 | 5 = 1) =>
    label && (
      <Form.Label htmlFor={label} className={`mb-${labelMargin}`}>
        <strong>{label}</strong>
      </Form.Label>
    );

  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Group className={`mb-${bottomMargin}`}>
        {labelPosition === 'top' ? (
          <>
            {renderLabel()}
            {renderInput()}
          </>
        ) : (
          <Row className="align-items-center justify-content-end">
            {labelPosition === 'left' && <Col xs="auto">{renderLabel(0)}</Col>}
            <Col xs="auto">{renderInput()}</Col>
            {labelPosition === 'right' && <Col xs="auto">{renderLabel(0)}</Col>}
          </Row>
        )}
        <Form.Text className={error ? 'text-danger' : 'text-muted'}>{error || helperText}</Form.Text>
      </Form.Group>
    </Col>
  );
}
