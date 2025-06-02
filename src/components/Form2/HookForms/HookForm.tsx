import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Form, Row} from 'react-bootstrap';
import {useForm, FormProvider, DefaultValues, FieldValues, SubmitHandler} from 'react-hook-form';
import {CSSProperties, ReactNode, FormEvent} from 'react';
import {ObjectSchema} from 'yup';
import {Spinner} from '@/components';

type FormProps<T extends FieldValues> = {
  children: ReactNode;
  id?: string;
  name?: string;
  schema?: ObjectSchema<T>;
  onSubmit?: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  className?: string;
  styles?: CSSProperties;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: string;
  submitLabel?: string;
  showSubmitButton?: boolean;
};

/**
 * HookForm component to wrap form elements and handle submission with react-hook-form and yup.
 * the wrapped children are wrapped into a row, so then you can use the bootstrap grid system.
 * It also provides a submit button with loading and disabled states.
 */
export const HookForm = <T extends Record<string, any> = Record<string, any>>({
  schema,
  onSubmit,
  children,
  defaultValues,
  isLoading = false,
  isDisabled = false,
  variant = 'success',
  submitLabel = 'Enviar',
  showSubmitButton = true,
  ...props
}: FormProps<T>) => {
  const methods = useForm<T>({
    resolver: schema ? (yupResolver(schema) as any) : undefined,
    defaultValues: schema ? schema.getDefault() : defaultValues,
    mode: 'onChange'
  });
  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (!isDisabled && !isLoading && onSubmit) {
            methods.handleSubmit(onSubmit)(e);
          }
        }}
        {...props}>
        <Row>{children}</Row>
        {showSubmitButton && (
          <Button type="submit" disabled={isDisabled || isLoading} variant={variant} className="w-100 mt-2">
            {isLoading ? <Spinner className="spinner-border-sm" tag="span" color="white" /> : submitLabel}
          </Button>
        )}
      </Form>
    </FormProvider>
  );
};
