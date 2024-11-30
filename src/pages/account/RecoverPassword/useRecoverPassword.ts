import {InferType, object, string} from 'yup';
import {useCallback, useState} from 'react';

export const recoverPasswordFormSchema = object({
  email: string()
    .email('Por favor ingrese un correo electrónico válido')
    .required('Por favor ingrese su correo electrónico')
});

export type recoverPasswordFormFields = InferType<typeof recoverPasswordFormSchema>;

export default function useRecoverPassword() {
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(async (values: recoverPasswordFormFields) => {
    setLoading(true);
    try {
      console.log('🚀 ~ onSubmit ~ values:', values);
    } catch (error: any) {
      console.log('🚀 ~ onSubmit ~ error:', {message: error.toString(), type: 'error'});
    } finally {
      setLoading(false);
    }
  }, []);

  return {loading, onSubmit};
}
