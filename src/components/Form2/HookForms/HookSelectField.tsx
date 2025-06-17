import {InputHTMLAttributes} from 'react';
import {Col, Form} from 'react-bootstrap';
import {Option} from '@/types';
import {useFormContext, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

interface SelectFieldProps extends InputHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: Option[];
  isLoadingOptions?: boolean;
  helperText?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  controlSize?: 'sm' | 'lg';
  bottomMargin?: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * selectField component to render a Bootstrap input field with label and error handling.
 */
export function HookSelectField({
  name,
  label,
  options,
  isLoadingOptions,
  helperText,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  controlSize,
  bottomMargin = 2,
  ...props
}: SelectFieldProps) {
  const {
    control,
    formState: {errors}
  } = useFormContext();

  const {t} = useTranslation();
  const fieldError = errors?.[name];
  const errorMessage = fieldError ? (fieldError.message as string) : undefined;

  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Form.Group className={`mb-${bottomMargin}`}>
        <Form.Label htmlFor={name} className="mb-1">
          <strong>{isLoadingOptions ? t('loading.default') : label}</strong>
        </Form.Label>
        <Controller
          name={name}
          control={control}
          render={({field, fieldState}) => (
            <Form.Select
              {...field}
              {...props}
              id={name}
              size={controlSize}
              placeholder={props.placeholder ?? label}
              isInvalid={!!fieldState.error}>
              {options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          )}
        />
        {isLoadingOptions && <Form.Text className="text-primary">{t('loading.default')}</Form.Text>}
        <Form.Text className={errorMessage ? 'text-danger' : 'text-muted'}>{errorMessage || helperText}</Form.Text>
      </Form.Group>
    </Col>
  );
}
