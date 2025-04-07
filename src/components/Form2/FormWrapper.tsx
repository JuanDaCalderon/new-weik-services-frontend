import {ReactNode, FormEvent} from 'react';
import {Form, Button, Row} from 'react-bootstrap';
import {Spinner} from '@/components';

interface FormWrapperProps {
  children: ReactNode;
  onSubmit?: () => Promise<void> | void;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: string;
  submitLabel?: string;
  showSubmitButton?: boolean;
}

/**
 * FormWrapper component to wrap form elements and handle submission.
 * the wrapped children are wrapped into a row, so then you can use the bootstrap grid system.
 * It also provides a submit button with loading and disabled states.
 * @param {ReactNode} children - The form elements to be wrapped.
 * @param {() => Promise<void> | void} onSubmit - The function to call on form submission.
 * @param {boolean} [isLoading=false] - Flag to indicate if the form is in a loading state.
 * @param {boolean} [isDisabled=false] - Flag to disable the submit button.
 * @param {string} [variant='success'] - The variant of the submit button.
 * @param {string} [submitLabel='Enviar'] - The label for the submit button.
 */
export function FormWrapper({
  children,
  onSubmit,
  isLoading = false,
  isDisabled = false,
  variant = 'success',
  submitLabel = 'Enviar',
  showSubmitButton = true
}: FormWrapperProps) {
  return (
    <Form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isDisabled && !isLoading && onSubmit) onSubmit();
      }}>
      <Row>{children}</Row>
      {showSubmitButton && (
        <Button type="submit" disabled={isDisabled || isLoading} variant={variant} className="w-100 mt-2">
          {isLoading ? <Spinner className="spinner-border-sm" tag="span" color="white" /> : submitLabel}
        </Button>
      )}
    </Form>
  );
}
