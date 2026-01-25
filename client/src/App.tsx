import React, { useEffect } from 'react';
import Routing from './app/routes';

// Redux
import { Provider } from 'react-redux';
import { store } from './app/store';
import setAuthToken from './features/auth/setAuthToken';
import { setUnauthenticated } from './features/auth';

const App = () => {
  useEffect(() => { 
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    
    // log user out from all tabs if they log out in one tab
    const handleStorage = () => {
      if (!localStorage.token) store.dispatch(setUnauthenticated());
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [setAuthToken, setUnauthenticated]);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <Routing />
      </Provider>
    </React.StrictMode>
  );
};

export default App;
