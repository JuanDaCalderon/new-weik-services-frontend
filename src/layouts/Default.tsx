import {Suspense, useMemo, JSX} from 'react';
import {PageLoader} from '@/components';
import config from '@/config';
import {getBoolean} from '@/utils';
import {Outlet} from 'react-router-dom';

const DefaultLayout = () => {
  const TestBox: JSX.Element = useMemo(() => {
    if (getBoolean(config.IS_TESTING ?? 'false'))
      return (
        <div className="alert alert-info position-absolute" role="alert" style={{zIndex: '9999'}}>
          <span className="text-primary">TEST ENV - {config.APP_VERSION}</span>
        </div>
      );
    else return <></>;
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      {TestBox}
      <Outlet />
    </Suspense>
  );
};
export default DefaultLayout;
