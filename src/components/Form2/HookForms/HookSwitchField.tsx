import {InputHTMLAttributes} from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import {useFormContext, Controller} from 'react-hook-form';

interface HookSwitchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string;
  label?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  bottomMargin?: 0 | 1 | 2 | 3 | 4 | 5;
  labelPosition?: 'top' | 'left' | 'right';
  customClass?: string;
}

/**
 * HookSwitchField component to render a Bootstrap switch (checkbox) with label,
 * error handling and support for react-hook-form and yup
 */
export function HookSwitchField({
  name,
  label,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  customClass,
  bottomMargin = 2,
  labelPosition = 'top',
  ...props
}: HookSwitchFieldProps) {
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

  const renderSwitch = () => (
    <Controller
      name={name}
      control={control}
      render={({field: {value, onChange, ...field}, fieldState}) => (
        <Form.Check
          {...field}
          {...props}
          id={name}
          className={customClass}
          type="switch"
          label={labelPosition === 'top' ? `${value ? 'Si' : 'No'}` : undefined}
          checked={!!value}
          isInvalid={!!fieldState.error}
          onChange={(e) => onChange(e.target.checked)}
        />
      )}
    />
  );

  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Group className={`mb-${bottomMargin}`}>
        {labelPosition === 'top' ? (
          <>
            {renderLabel()}
            {renderSwitch()}
          </>
        ) : (
          <Row className="align-items-center justify-content-end">
            {labelPosition === 'left' && <Col xs="auto">{renderLabel(0)}</Col>}
            <Col xs="auto">{renderSwitch()}</Col>
            {labelPosition === 'right' && <Col xs="auto">{renderLabel(0)}</Col>}
          </Row>
        )}
        <Form.Text className={errorMessage ? 'text-danger' : 'text-muted'}>{errorMessage}</Form.Text>
      </Form.Group>
    </Col>
  );
}
