import {ReactNode, useState} from 'react';
import {Control, Controller, RegisterOptions} from 'react-hook-form';
import {Form, InputGroup} from 'react-bootstrap';
import {FeedbackInvalidText, LabelText} from './FormUtils';

type PasswordInputProps = {
  name: string;
  type?: 'password';
  id?: string;
  label?: string;
  className?: string;
  containerClass?: string;
  errors?: Record<string, {message: string}>;
  placeholder?: string;
  helpText?: string;
  register?: RegisterOptions;
  control?: Control<any>;
  children?: ReactNode;
};

export default function PasswordInput({
  name,
  id,
  label,
  className,
  containerClass,
  helpText,
  children,
  control,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
        <Form.Group className={containerClass}>
          {label && (
            <>
              {children}
              <LabelText label={label} />
            </>
          )}
          <InputGroup className="mb-0">
            <Form.Control
              {...props}
              {...field}
              type={showPassword ? 'text' : 'password'}
              value={field.value ?? ''}
              id={id}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              autoComplete="current-password"
              className={className}
              isInvalid={Boolean(fieldState.error?.message)}
            />
            <div
              className={`input-group-text input-group-password ${showPassword ? 'show-password' : ''}`}
              data-password={showPassword ? 'true' : 'false'}>
              <span
                className="password-eye"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}></span>
            </div>
          </InputGroup>
          {helpText && (
            <Form.Text id={`${name}-help`} muted>
              {helpText}
            </Form.Text>
          )}
          {fieldState.error && (
            <FeedbackInvalidText errorMessage={fieldState.error['message'] ?? ''} customClassNames="d-block" />
          )}
        </Form.Group>
      )}
    />
  );
}
