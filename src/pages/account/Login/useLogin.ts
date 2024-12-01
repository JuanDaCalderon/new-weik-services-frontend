import {useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {setUser} from '@/store/slices/user';
import {object, string, boolean, InferType} from 'yup';
import {extractDomain} from '@/utils';
import {useAuth} from '@/endpoints';
import {DebugUtil} from '@/utils';
import {useNavigate} from 'react-router-dom';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = useCallback(
    async ({email, password, rememberme}: LoginFormFields) => {
      setLoading(true);
      try {
        const user = await authLogIn({email, password});
        if (user) {
          dispatch(setUser({user, domain: extractDomain(email), isLoggedIn: true, rememberme}));
          DebugUtil.logSuccess('Sesión iniciada en el store', user);
          setTimeout(() => {
            navigate('/services/dashboard');
          }, 3000);
        }
      } catch (error: any) {
        DebugUtil.logError(error.toString(), error);
      } finally {
        setLoading(false);
      }
    },
    [authLogIn, dispatch, navigate]
  );

  return {loading, login};
}
