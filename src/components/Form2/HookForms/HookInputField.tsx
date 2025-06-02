import {InputHTMLAttributes} from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {useFormContext, Controller} from 'react-hook-form';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  controlSize?: 'sm' | 'lg';
  as?: 'input' | 'textarea';
  bottomMargin?: 0 | 1 | 2 | 3 | 4 | 5;
  labelPosition?: 'top' | 'left' | 'right';
  rows?: number;
}

/**
 * HookInputField component to render a Bootstrap input field with label and
 * error handling with support for react-hook-form and yup
 */
export function HookInputField({
  name,
  label,
  helperText,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  controlSize = 'sm',
  as = 'input',
  bottomMargin = 2,
  labelPosition = 'top',
  rows,
  ...props
}: InputFieldProps) {
  const {
    control,
    formState: {errors}
  } = useFormContext();

  const fieldError = errors?.[name];
  const errorMessage = fieldError ? (fieldError.message as string) : undefined;

  const renderLabel = (labelMargin: 0 | 1 | 2 | 3 | 4 | 5 = 1) =>
    label && (
      <Form.Label htmlFor={name} className={`mb-${labelMargin}`}>
        <strong>{label}</strong>
      </Form.Label>
    );

  const renderInput = () => (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
        <Form.Control
          {...field}
          {...{
            ...props,
            id: name,
            size: controlSize,
            value: field.value ?? '',
            placeholder: props.placeholder ?? label,
            rows: rows
          }}
          isInvalid={!!fieldState.error}
          as={as}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );

  return (
    <>
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
          <Form.Text className={errorMessage ? 'text-danger' : 'text-muted'}>{errorMessage || helperText}</Form.Text>
        </Form.Group>
      </Col>
    </>
  );
}
