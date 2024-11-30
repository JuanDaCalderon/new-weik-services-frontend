import {JSX, useMemo} from 'react';
import {Form, SendButton, TextInput} from '@/components';
import AccountWrapper from '@/pages/account/AccountWrapper';
import {Col, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import useRecoverPassword, {
  recoverPasswordFormFields,
  recoverPasswordFormSchema
} from './useRecoverPassword';
import {DEFAULT_ROUTER_PATH} from '@/constants';

const RecoverPassword = () => {
  const {loading, onSubmit} = useRecoverPassword();

  const bottomLink: JSX.Element = useMemo(
    () => (
      <Row className="mt-3">
        <Col className="text-center">
          <p className="text-dark text-opacity-75">
            Olvidalo, ya la recordé
            <Link to={DEFAULT_ROUTER_PATH} className="text-dark text-opacity-75 ms-1">
              <b>Ingresar</b>
            </Link>
          </p>
        </Col>
      </Row>
    ),
    []
  );

  return (
    <>
      <AccountWrapper bottomLinks={bottomLink}>
        <div className="text-center w-75 m-auto">
          <h4 className="text-dark text-center mt-0 fw-bold">Restablecer contraseña</h4>
          <p className="text-dark text-opacity-75">
            Ingrese su dirección de correo electrónico y le enviaremos un correo electrónico con
            instrucciones para restablecer su contraseña.
          </p>
        </div>
        <Form<recoverPasswordFormFields> onSubmit={onSubmit} schema={recoverPasswordFormSchema}>
          <TextInput
            label={'Dirección de correo electrónico'}
            type="email"
            name="email"
            placeholder={'Ingresa tu correo electrónico'}
            containerClass={'mb-2'}
            autoComplete="email"
          />
          <SendButton loading={loading} text="Recuperar contraseña" />
        </Form>
      </AccountWrapper>
    </>
  );
};

export default RecoverPassword;
