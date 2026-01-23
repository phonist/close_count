import React, { useEffect } from 'react';
import Routing from './components/routing';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { SET_UNAUTHENTICATED } from './types/AuthTypes';

const App = () => {
  useEffect(() => { 
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    
    // log user out from all tabs if they log out in one tab
    // eslint-disable-next-line no-unreachable
    const handleStorage = () => {
      if (!localStorage.token) store.dispatch({ type: SET_UNAUTHENTICATED });
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <Routing />
      </Provider>
    </React.StrictMode>
  );
};

export default App;
