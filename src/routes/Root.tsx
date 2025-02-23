import {DEFAULT_HOME_ROUTER_PATH, DEFAULT_ROUTER_PATH} from '@/constants';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector} from '@/store/selectores/user';
import {Navigate} from 'react-router-dom';

const Root = () => {
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  if (isLoggedIn) return <Navigate to={DEFAULT_HOME_ROUTER_PATH} />;
  else return <Navigate to={DEFAULT_ROUTER_PATH} />;
};

export default Root;
