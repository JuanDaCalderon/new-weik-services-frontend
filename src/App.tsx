import AppRoutes from '@/routes';
import {ThemeProvider} from '@/common/context';
import './assets/scss/Saas.scss';

const App = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;
