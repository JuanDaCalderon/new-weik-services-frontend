import {useState} from 'react';
import {selectUser, selectUserDomain} from '@/store/selectores';
import {Container} from 'react-bootstrap';
import {useAppSelector} from '@/store';
import {getNombreCompletoUser} from '@/utils';
import {SkeletonLoader} from '../SkeletonLoader';
import {Link} from 'react-router-dom';
import {PERFIL_MENU_KEY} from '@/constants';
import fallBackLogo from '@/assets/images/logo-fallback.png';

const HomeHeader = () => {
  const user = useAppSelector(selectUser);
  const userDomain = useAppSelector(selectUserDomain);
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);

  return (
    <Container fluid className="d-flex justify-content-center flex-column align-items-center text-center">
      <div className="position-relative">
        {!iconHasLoad && <SkeletonLoader customClass="position-absolute p-0" />}
        <img
          src={user.userImage ? user.userImage : fallBackLogo}
          alt={userDomain ?? ''}
          className="img-thumbnail avatar-xl rounded-circle object-fit-cover"
          loading="lazy"
          onLoad={() => setIconHasLoad(true)}
        />
      </div>
      <h4 className="text-uppercase my-1">{userDomain}</h4>
      <Link to={PERFIL_MENU_KEY} className="text-uppercase mb-1">
        <i className="mdi mdi-email-outline me-1"></i>
        {user.email}
      </Link>
      <Link to={PERFIL_MENU_KEY} className="text-uppercase mb-1">
        <i className="mdi mdi-card-account-details-outline me-1"></i>
        {getNombreCompletoUser(user)}
      </Link>
      <p className="fw-semibold">
        Plataforma de administración de proyectos “<span className="fw-bold text-capitalize">DEVIKGO</span>”
      </p>
    </Container>
  );
};

export default HomeHeader;
