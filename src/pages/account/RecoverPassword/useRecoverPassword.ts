import {InferType, object, string} from 'yup';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import {useAuth} from '@/endpoints';
import {useNavigate} from 'react-router-dom';
import {PAGE_CONFIRM_EMAIL} from '@/constants';

export const recoverPasswordFormSchema = object({
  email: string()
    .email('Por favor ingrese un correo electrónico válido')
    .required('Por favor ingrese su correo electrónico')
});

export type recoverPasswordFormFields = InferType<typeof recoverPasswordFormSchema>;

export default function useRecoverPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {authRecoverPassword} = useAuth();

  const onSubmit = useCallback(
    async ({email}: recoverPasswordFormFields) => {
      setLoading(true);
      try {
        const emailSent = await authRecoverPassword({email});
        if (emailSent) {
          DebugUtil.logSuccess('Correo de recuperación de contraseña enviado', email);
          navigate(`${PAGE_CONFIRM_EMAIL}/${emailSent}`);
        }
      } catch (error: any) {
        DebugUtil.logError(error.toString(), error);
      } finally {
        setLoading(false);
      }
    },
    [authRecoverPassword, navigate]
  );

  return {loading, onSubmit};
}
