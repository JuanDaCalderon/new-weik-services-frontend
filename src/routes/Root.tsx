import {DEFAULT_ROUTER_PATH} from '@/constants';
import {Navigate} from 'react-router-dom';

const Root = () => {
  return <Navigate to={DEFAULT_ROUTER_PATH} />;
};

export default Root;
