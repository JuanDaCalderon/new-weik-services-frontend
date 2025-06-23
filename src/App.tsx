import AppRoutes from '@/routes';
import {ThemeProvider} from '@/common/context';
import {useAppVersionChecker} from '@/hooks';
import './assets/scss/Saas.scss';

const App = () => {
  useAppVersionChecker();
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
