import {useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {setUser} from '@/store/slices/user';
import {object, string, boolean, InferType} from 'yup';
import {extractDomain} from '@/utils';
import {useAuth} from '@/endpoints';

export const loginFormSchema = object({
  email: string()
    .email('Por favor ingrese un correo electrónico válido')
    .required('Por favor ingrese su correo electrónico'),
  password: string().required('Por favor, introduzca la contraseña'),
  rememberme: boolean()
});

export type LoginFormFields = InferType<typeof loginFormSchema>;

export default function useLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const {authLogIn} = useAuth();
  const dispatch = useDispatch();

  const login = useCallback(
    async ({email, password, rememberme}: LoginFormFields) => {
      setLoading(true);
      try {
        const user = await authLogIn({email, password});
        if (user) dispatch(setUser({user, domain: extractDomain(email), isLoggedIn: true}));
        console.info('🚀 ~ rememberme:', rememberme);
      } catch (error: any) {
        console.error('🚀 ~ login ~ error:', {message: error.toString(), type: 'error'});
      } finally {
        setLoading(false);
      }
    },
    [authLogIn, dispatch]
  );

  return {loading, login};
}
