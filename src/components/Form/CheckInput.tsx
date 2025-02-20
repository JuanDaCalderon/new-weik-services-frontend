import {ReactNode} from 'react';
import {Form} from 'react-bootstrap';
import {Control, Controller, RegisterOptions} from 'react-hook-form';
import {FeedbackInvalidText, LabelText} from './FormUtils';

type CheckInputProps = {
  type: 'checkbox' | 'radio';
  id?: string;
  name: string;
  className?: string;
  containerClass?: string;
  label?: string | ReactNode;
  placeholder?: string;
  helpText?: string;
  errors?: any;
  control?: Control<any>;
  register?: RegisterOptions;
  defaultChecked?: boolean;
};

export default function CheckInput({
  name,
  id,
  control,
  className,
  containerClass,
  label,
  placeholder,
  helpText,
  errors,
  type,
  defaultChecked,
  ...props
}: CheckInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
        <Form.Group className={`${containerClass} d-flex gap-1`}>
          <Form.Check
            type={type}
            id={id ?? name}
            {...props}
            {...field}
            value={field.value ?? ''}
            onChange={(e) => {
              field.onChange(e.target.checked);
            }}
            placeholder={placeholder}
            className={className}
            isInvalid={Boolean(fieldState.error?.message)}
            defaultChecked={defaultChecked}
          />
          {label && <LabelText label={label} htmlFor={id ?? name} />}
          {helpText && (
            <Form.Text id={`${name}-help`} muted>
              {helpText}
            </Form.Text>
          )}
          {errors || (fieldState.error && <FeedbackInvalidText errorMessage={fieldState.error['message'] ?? ''} />)}
        </Form.Group>
      )}
    />
  );
}
