import App from './App';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import {store} from './store';
const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <BrowserRouter basename="">
        <SimpleBar style={{maxHeight: '100vh'}}>
          <App />
        </SimpleBar>
      </BrowserRouter>
    </Provider>
  );
}
