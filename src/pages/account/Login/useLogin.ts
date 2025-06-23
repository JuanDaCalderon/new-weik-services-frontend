import {useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {setUser} from '@/store/slices/user';
import {object, string, boolean, InferType} from 'yup';
import {extractDomain} from '@/utils';
import {useAuth} from '@/endpoints';
import {DebugUtil} from '@/utils';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {HOME_ROUTER_PATH} from '@/constants';

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
        let user = await authLogIn({email, password});
        if (user) {
          dispatch(
            setUser({
              user,
              domain: extractDomain(email),
              isLoggedIn: true,
              rememberme: !!rememberme
            })
          );
          DebugUtil.logSuccess('Sesión iniciada en el store', user);
          navigate(HOME_ROUTER_PATH);
          setTimeout(() => {
            toast.success(`Has iniciado sesión correctamente como ${user?.email}`);
          }, 1000);
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
