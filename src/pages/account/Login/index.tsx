import {Form, PasswordInput, TextInput, CheckInput, SendButton} from '@/components';
import {Col, Row} from 'react-bootstrap';
import {Link, Navigate} from 'react-router-dom';
import AccountWrapper from '@/pages/account/AccountWrapper';
import useLogin, {LoginFormFields, loginFormSchema} from './useLogin';
import {PAGE_RECOVERY_PASSWORD} from '@/constants';
import toast, {Toaster} from 'react-hot-toast';
import {useEffect} from 'react';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector} from '@/store/selectores';

export default function Login() {
  const {loading, login} = useLogin();
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  useEffect(() => {
    toast.remove();
  }, []);
  if (isLoggedIn) return <Navigate to="/services/dashboard" />;
  return (
    <AccountWrapper>
      <div className="text-center w-75 m-auto">
        <h4 className="text-dark text-center fw-bold">Ingresar</h4>
        <p className="text-dark text-opacity-75">
          Ingresa tu dirección de correo y contraseña del portal WEIK para poder acceder.
        </p>
      </div>
      <Form<LoginFormFields>
        onSubmit={login}
        schema={loginFormSchema}
        defaultValues={{email: '', password: '', rememberme: false}}>
        <Row>
          <Col>
            <TextInput
              name="email"
              label={'Dirección de correo'}
              type="email"
              autoComplete="email"
              placeholder={'Ingresa tu dirección de correo'}
              containerClass="mb-2"
            />
          </Col>
        </Row>
        <PasswordInput
          label={'Contraseña'}
          name="password"
          placeholder={'Ingresa tu contraseña'}
          containerClass="mb-2">
          <Link to={PAGE_RECOVERY_PASSWORD} className="text-dark text-opacity-75 float-end">
            <small>Olvidaste tu contraseña?</small>
          </Link>
        </PasswordInput>
        <CheckInput
          name="rememberme"
          type="checkbox"
          label="Recuerdame"
          containerClass="mb-1"
          defaultChecked={false}
        />
        <SendButton loading={loading} text="Ingresar" />
      </Form>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </AccountWrapper>
  );
}
