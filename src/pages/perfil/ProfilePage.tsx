import {Row, Col} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import UserPortadaBox from './UserPortadaBox';
import InfoUserBox from './InfoUserBox';
import HubLaboral from './HubLaboral';
import UserRolesYPermisos from './RolesYPermisos';
import PasswordBox from './PasswordBox';
import {ToastWrapper} from '@/components/Toast';
import Joyride, {CallBackProps, Step} from 'react-joyride';
import {useEffect, useState} from 'react';
import {LocalStorageUtil} from '@/utils';
import {LOCALSTORAGE_TOUR_KEY} from '@/constants';

const steps: Step[] = [
  {
    target: '#profile-image',
    content:
      'Puedes actualizar tu foto de perfil cuando quieras 📸. Solo haz clic en el ícono de arriba ☝️ ¡Recuerda elegir tu mejor foto para que todos te reconozcan! 😎',
    disableScrolling: true
  },
  {
    target: '#profile-info',
    content:
      'Aquí verás tus datos más importantes: tu nombre completo 👤, nombre de usuario 🆔, correo electrónico 📧 y los roles que tienes dentro de la plataforma 🛠️. ¡Revisa que todo esté correcto!',
    disableScrolling: true
  },
  {
    target: '#user-info-switch',
    content:
      'Puedes modificar tus datos personales cuando quieras, solo oprime el interruptor. Recuerda mantener tu información actualizada para que todo funcione correctamente 🧠.',
    disableScrolling: true
  },
  {
    target: '#user-password-box',
    content:
      'Si deseas cambiar tu contraseña, puedes hacerlo aquí. Solo asegúrate de recordarla bien para evitar problemas al iniciar sesión 🔑😉.'
  },
  {
    target: '#user-roles-permisos',
    content:
      'Aquí puedes ver los roles y permisos que tienes dentro de la plataforma. Si necesitas más información, consulta con tu administrador o líder de equipo 🛠️.'
  },
  {
    target: '#calendar',
    content:
      'Aquí podrás ver tu calendario, donde se mostrarán eventos 📌 y tu horario 🕒. ¡Mantente organizado y al tanto de todo lo que tienes programado! ✅'
  }
];

const ProfilePage = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const tourAlreadyDone = LocalStorageUtil.getItem<boolean>(LOCALSTORAGE_TOUR_KEY);
    if (!tourAlreadyDone) setRun(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const {status} = data;
    const finishedStatuses = ['finished', 'skipped'];
    if (finishedStatuses.includes(status)) {
      LocalStorageUtil.setItem(LOCALSTORAGE_TOUR_KEY, true);
      setRun(false);
    }
  };

  return (
    <ToastWrapper>
      <Joyride steps={steps} run={run} continuous showSkipButton showProgress callback={handleJoyrideCallback} />
      <PageBreadcrumb title="Mi Cuenta" />

      <Row>
        <Col xs={12} xl={4} xxl={3}>
          <UserPortadaBox />
          <InfoUserBox />
          <PasswordBox />
          <UserRolesYPermisos />
        </Col>

        <Col xs={12} xl={8} xxl={9}>
          <HubLaboral />
        </Col>
      </Row>
    </ToastWrapper>
  );
};

export {ProfilePage};
