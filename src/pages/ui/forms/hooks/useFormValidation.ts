import {useToggle} from '@/hooks';
import {FormEvent} from 'react';

export default function useFormValidation() {
  const [isValidated, setValidated] = useToggle();

  /*
   * handle form submission
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated();
  };

  return {
    isValidated,
    handleSubmit
  };
}
