import AccountWrapper from '@/pages/account/AccountWrapper';
import {Link} from 'react-router-dom';
import mailSent from '@/assets/images/svg/mail_sent.svg';
import {DEFAULT_ROUTER_PATH} from '@/constants';
import {useEffect} from 'react';
import toast from 'react-hot-toast';
import {useParams} from 'react-router-dom';

const ConfirmMail = () => {
  const {email} = useParams();

  useEffect(() => {
    toast.remove();
  }, []);

  return (
    <AccountWrapper>
      <div className="text-center m-auto">
        <img src={mailSent} alt="mail sent" height="64" loading="lazy" />
        <h4 className="text-dark text-center mt-3 fw-bold">
          Por favor revise su correo electrónico
        </h4>
        <p className="text-dark text-opacity-75 mb-3">
          Se ha enviado un correo electrónico a &nbsp;<b>{email}</b>.&nbsp; Verifique si recibió un
          correo electrónico y haga clic en el enlace incluido para restablecer su contraseña.
        </p>
        <p className="mb-0 text-center">
          <Link className="btn btn-primary" to={DEFAULT_ROUTER_PATH}>
            <i className="mdi mdi-home me-1"></i> Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </AccountWrapper>
  );
};

export default ConfirmMail;
