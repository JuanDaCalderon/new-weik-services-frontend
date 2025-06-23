import {HOME_ROUTER_PATH, LOGIN_ROUTER_PATH} from '@/constants';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector} from '@/store/selectores/user';
import {Navigate} from 'react-router-dom';

const Root = () => {
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  if (isLoggedIn) return <Navigate to={HOME_ROUTER_PATH} />;
  else return <Navigate to={LOGIN_ROUTER_PATH} />;
};

export default Root;
