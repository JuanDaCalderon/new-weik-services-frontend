import AppRoutes from '@/routes';
import {ThemeProvider} from '@/common/context';
import './assets/scss/Saas.scss';
import {useAppVersionChecker} from '@/hooks';

const App = () => {
  useAppVersionChecker();
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
